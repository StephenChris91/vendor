// app/api/products/[productId]/total-sold/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../../prisma/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { productId: string } }
) {
    const productId = params.productId;

    if (!productId) {
        return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    try {
        // Calculate the total sold amount for the product
        const totalSold = await db.orderItem.aggregate({
            where: {
                productId: productId,
                order: {
                    status: 'Completed'  // Only consider completed orders
                }
            },
            _sum: {
                price: true,
                quantity: true
            }
        });

        // Calculate the total amount
        const totalAmount = (totalSold._sum.price || 0) * (totalSold._sum.quantity || 0);

        return NextResponse.json({ totalSold: totalAmount });
    } catch (error) {
        console.error('Error fetching total sold:', error);
        return NextResponse.json({ error: 'Failed to fetch total sold' }, { status: 500 });
    }
}