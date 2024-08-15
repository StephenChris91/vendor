// app/actions/productActions.ts
'use server'

import { db } from "../../../prisma/prisma";
import { Product } from "@models/product.model";

export async function getProduct(id: string): Promise<Product> {
    try {
        const product = await db.product.findFirst({
            where: { id },
            include: {
                categories: true,
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                        slug: true,
                    },
                },
            },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            sale_price: product.sale_price ?? 0,
            sku: product.sku,
            quantity: product.quantity,
            in_stock: product.in_stock,
            is_taxable: product.is_taxable,
            status: product.status,
            product_type: product.product_type,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
            total_reviews: product.total_reviews ?? 0,
            my_review: product.my_review ?? null,
            in_wishlist: product.in_wishlist ?? false,
            categories: product.categories.map(category => ({
                productId: category.productId,
                categoryId: category.categoryId,
            })),
            shop: product.shop ? {
                id: product.shop.id,
                shopName: product.shop.shopName,
            } : null,
            shop_name: product.shop?.shopName ?? null,
            stock: product.stock ?? 0,
            user: null, // Assuming user data is not needed here
            brandId: product.brandId,
            isFlashDeal: product.isFlashDeal ?? false,
            discountPercentage: product.discountPercentage ?? 0,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error('Failed to fetch product');
    }
}