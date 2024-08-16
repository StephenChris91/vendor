import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const discountedProducts = await db.product.findMany({
            where: {
                discountPercentage: {
                    gt: 1 // This filters for products with discount greater than 1
                }
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                shop: true,
                brand: true
            }
        });

        const formattedProducts = discountedProducts.map(product => ({
            ...product,
            categories: product.categories.map(pc => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug
            })),
            shop_name: product.shop?.shopName || null,
            brand: product.brand ? {
                id: product.brand.id,
                name: product.brand.name,
                slug: product.brand.slug
            } : null
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching discounted products:', error);
        return NextResponse.json({ error: 'Failed to fetch discounted products' }, { status: 500 });
    }
}