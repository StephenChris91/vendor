import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const mobileProducts = await db.product.findMany({
            where: {
                categories: {
                    some: {
                        category: {
                            name: 'Watch'
                        }
                    }
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

        const formattedProducts = mobileProducts.map(product => ({
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
        console.error('Error fetching mobile products:', error);
        return NextResponse.json({ error: 'Failed to fetch mobile products' }, { status: 500 });
    }
}