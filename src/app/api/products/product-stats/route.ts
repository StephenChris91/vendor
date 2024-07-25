// app/api/admin/product-stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const totalProducts = await db.product.count();

        const outOfStock = await db.product.count({
            where: {
                status: 'OutOfStock',
            },
        });

        const lowStock = await db.product.count({
            where: {
                quantity: {
                    gt: 0,
                    lte: 10, // Assuming low stock is 10 or fewer items
                },
            },
        });

        const stats = {
            totalProducts,
            outOfStock,
            lowStock,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error('Error fetching product stats:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}