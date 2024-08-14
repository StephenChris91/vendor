'use server'

import Product from "@models/product.model";
import { db } from "../../../prisma/prisma";

export async function getFrequentlyBought(id: string): Promise<Product[]> {
    try {
        const products = await db.product.findMany({
            where: { status: 'Published' },
            take: 4,
            orderBy: {
                total_reviews: 'desc',
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                },
                shop: {
                    select: {
                        shopName: true,
                    },
                },
            },
        });

        return products.map(product => ({
            id: product.id,
            name: product.name,
            sale_price: product.sale_price ?? 0,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
            categories: product.categories.map(pc => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug, // Add this line
            })),
            shop: product.shop ? {
                shopName: product.shop.shopName,
            } : null
        })) as Product[]; // Add type assertion here
    } catch (error) {
        console.error("Error fetching frequently bought products:", error);
        throw new Error('Failed to fetch frequently bought products');
    }
}