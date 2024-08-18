// app/api/vendor/dashboard/summary/route.ts
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

        const totalSales = await db.shopOrder.aggregate({
            where: { shop: { userId: vendorId } },
            _sum: { totalPrice: true },
        });

        const totalOrders = await db.shopOrder.count({
            where: { shop: { userId: vendorId } },
        });

        const totalProducts = await db.product.count({
            where: { user_id: vendorId },
        });

        return NextResponse.json([
            { title: "Total Sales", amount: totalSales._sum.totalPrice || 0, subtitle: "Total sales amount" },
            { title: "Total Orders", amount: totalOrders, subtitle: "Total number of orders" },
            { title: "Total Products", amount: totalProducts, subtitle: "Total number of products" },
        ]);
    } catch (error) {
        console.error("Error fetching summary:", error);
        return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
    }
}