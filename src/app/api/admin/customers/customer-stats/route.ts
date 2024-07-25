// app/api/admin/customer-stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';

export async function GET() {
    try {
        const totalCustomers = await db.user.count({
            where: { role: 'Customer' },
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newCustomers = await db.user.count({
            where: {
                role: 'Customer',
                createdAt: { gte: thirtyDaysAgo },
            },
        });

        const totalSpent = await db.order.aggregate({
            _sum: {
                totalPrice: true,
            },
        });

        const averageSpend = totalCustomers > 0
            ? (totalSpent._sum.totalPrice || 0) / totalCustomers
            : 0;

        const stats = {
            totalCustomers,
            newCustomers,
            averageSpend,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching customer stats:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}