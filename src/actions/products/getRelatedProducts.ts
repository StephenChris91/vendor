'use server'

import Product from "@models/product.model";
import { db } from "../../../prisma/prisma";

export async function getRelatedProducts(id: string): Promise<Product[]> {
    try {
        const product = await db.product.findFirst({
            where: { id },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        const relatedProducts = await db.product.findMany({
            where: {
                categories: {
                    some: {
                        categoryId: {
                            in: product.categories.map(pc => pc.categoryId)
                        },
                    },
                },
                id: { not: product.id },
                status: 'Published',
            },
            take: 4,
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

        return relatedProducts.map(product => ({
            id: product.id,
            name: product.name,
            sale_price: product.sale_price ?? 0,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
            categories: product.categories.map(pc => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug,  // Add this line
            })),
            shop: product.shop ? {
                shopName: product.shop.shopName,
            } : null
        })) as Product[];  // Add type assertion here
    } catch (error) {
        console.error("Error fetching related products:", error);
        throw new Error('Failed to fetch related products');
    }
}