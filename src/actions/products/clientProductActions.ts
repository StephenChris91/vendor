// app/actions/productActions.ts
'use server'


import { db } from "../../../prisma/prisma";

export async function getProduct(id: string) {
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
            sale_price: product.sale_price ?? 0,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
            // categories: product.categories.map(category => ({
            //     id: category.categoryId,
            //     name: category?.name,
            // })),
            shop: product.shop ? {
                id: product.shop.id,
                shopName: product.shop.shopName,
                slug: product.shop.slug,
            } : null
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error('Failed to fetch product');
    }
}



