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
                shop: true,
            },
        });

        return products.map(product => ({
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
            user: null, // Assuming user data is not needed for frequently bought products
            brandId: product.brandId,
            isFlashDeal: product.isFlashDeal,
            discountPercentage: product.discountPercentage,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })) as Product[];
    } catch (error) {
        console.error("Error fetching frequently bought products:", error);
        throw new Error('Failed to fetch frequently bought products');
    }
}