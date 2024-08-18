// app/api/vendor/dashboard/sales/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const session = await useCurrentSession();

    if (!session || session.user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const vendorId = session.user.id;

        const salesData = await db.shopOrder.groupBy({
            by: ['createdAt'],
            where: { shop: { userId: vendorId } },
            _sum: { totalPrice: true },
            orderBy: { createdAt: 'asc' },
            take: 30,
        });

        return NextResponse.json({
            labels: salesData.map(item => item.createdAt.toISOString().split('T')[0]),
            data: salesData.map(item => item._sum.totalPrice || 0),
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
    }
}