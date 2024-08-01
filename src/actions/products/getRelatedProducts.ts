// actions/products/getProducts.ts

import { db } from "../../../prisma/prisma";

export async function getRelatedProducts(slug: string) {
    try {
        // First, find the product by slug
        const product = await db.product.findFirst({
            where: { slug },
            include: { categories: true },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // Now use the product's ID to find related products
        const relatedProducts = await db.product.findMany({
            where: {
                categories: {
                    some: {
                        id: { in: product.categories.map(c => c.id) },
                    },
                },
                id: { not: product.id },
                status: 'Published',
            },
            take: 4,
            include: {
                categories: true,
                shop: {
                    select: {
                        shopName: true,
                    },
                },
            },
        });

        return relatedProducts.map(product => ({
            ...product,
            sale_price: product.sale_price ?? 0,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
        }));
    } catch (error) {
        console.error("Error fetching related products:", error);
        throw new Error('Failed to fetch related products');
    }
}