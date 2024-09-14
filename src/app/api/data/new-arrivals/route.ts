import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    console.log('New arrivals route hit');
    try {
        const newArrivals = await db.product.findMany({
            where: {
                status: 'Published', // Only fetch approved products
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                sale_price: true,
                image: true,
                ratings: true,
                createdAt: true,
                shop: {
                    select: {
                        shopName: true,
                        slug: true,
                    },
                },
            },
        });

        console.log('New arrivals fetched:', newArrivals);

        const formattedNewArrivals = newArrivals.map(product => ({
            ...product,
            sale_price: product.sale_price ?? 0, // Set sale_price to 0 if it's null
            image: product.image ?? "", // Set image to empty string if it's null
            ratings: product.ratings ?? 0, // Set ratings to 0 if it's null
        }));

        return NextResponse.json(formattedNewArrivals);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        return NextResponse.json({ error: 'Failed to fetch new arrivals' }, { status: 500 });
    }
}