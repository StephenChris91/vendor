'use server'

import { db } from "../../../prisma/prisma";
import Product from "@models/product.model";

export async function getAllProducts(page: number, pageSize: number): Promise<{ products: Product[], meta: any }> {
    const products = await db.product.findMany({
        where: { status: 'Published' },

        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
            shop: true,
            categories: true,
            user: true,
        },
    });

    return {
        products: products.map((product): Product => ({
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
            categories: product.categories,
            shop: product.shop ? {
                id: product.shop.id,
                shopName: product.shop.shopName
            } : null,
            user: product.user,
            brandId: product.brandId,
            isFlashDeal: product.isFlashDeal,
            discountPercentage: product.discountPercentage,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        })),
        meta: {
            page,
            pageSize,
            total: await db.product.count(),
            totalPage: Math.ceil((await db.product.count()) / pageSize),
        },
    };
}