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
                shop: true,
            },
        });

        return relatedProducts.map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            sale_price: product.sale_price,
            sku: product.sku,
            quantity: product.quantity,
            in_stock: product.in_stock,
            is_taxable: product.is_taxable,
            status: product.status,
            product_type: product.product_type,
            image: product.image,
            ratings: product.ratings,
            total_reviews: product.total_reviews,
            my_review: product.my_review,
            in_wishlist: product.in_wishlist,
            gallery: product.gallery,
            shop_name: product.shop?.shopName ?? null,
            stock: product.stock,
            categories: product.categories.map(pc => ({
                productId: pc.productId,
                categoryId: pc.categoryId,
            })),
            shop: product.shop ? {
                id: product.shop.id,
                shopName: product.shop.shopName,
            } : null,
            user: null, // Assuming user data is not needed for related products
            brandId: product.brandId,
            isFlashDeal: product.isFlashDeal,
            discountPercentage: product.discountPercentage,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })) as Product[];
    } catch (error) {
        console.error("Error fetching related products:", error);
        throw new Error('Failed to fetch related products');
    }
}