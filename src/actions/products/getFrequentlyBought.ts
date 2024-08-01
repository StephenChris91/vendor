'use server'

import { db } from "../../../prisma/prisma";



export async function getFrequentlyBought(slug: string) {
    try {
        // This is a placeholder implementation. In a real-world scenario,
        // you might want to implement this based on actual purchase data.
        const products = await db.product.findMany({
            where: { status: 'Published' },
            take: 4,
            orderBy: {
                total_reviews: 'desc',  // Assuming frequently bought items have more reviews
            },
            include: {
                categories: true,
                shop: {
                    select: {
                        shopName: true,
                    },
                },
            },
        });

        return products.map(product => ({
            ...product,
            sale_price: product.sale_price ?? 0,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
        }));
    } catch (error) {
        console.error("Error fetching frequently bought products:", error);
        throw new Error('Failed to fetch frequently bought products');
    }
}