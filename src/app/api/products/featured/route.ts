import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const shopId = request.nextUrl.searchParams.get('shopId');

    try {
        const products = await db.product.findMany({
            where: shopId ? { shop_id: shopId } : {},
            take: 8, // Limit to 8 products per shop
            orderBy: {
                createdAt: 'desc' // Get the most recent products
            },
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true
                    }
                }
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ message: 'Error fetching products' }, { status: 500 });
    }
}