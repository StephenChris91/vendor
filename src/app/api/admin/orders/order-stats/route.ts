// app/api/admin/order-stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';

export async function GET() {
    try {
        const totalOrders = await db.order.count();

        const pendingOrders = await db.order.count({
            where: {
                status: 'Pending', // Adjust this based on your status field values
            },
        });

        const totalRevenue = await db.order.aggregate({
            _sum: {
                totalPrice: true,
            },
        });

        const averageOrderValue = totalOrders > 0
            ? (totalRevenue._sum.totalPrice || 0) / totalOrders
            : 0;

        const stats = {
            totalOrders,
            pendingOrders,
            totalRevenue: totalRevenue._sum.totalPrice || 0,
            averageOrderValue,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching order stats:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}