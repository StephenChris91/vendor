// app/actions/productActions.ts
'use server'

import { db } from "../../../prisma/prisma";


export async function getProduct(slug: string) {
    try {
        const product = await db.product.findFirst({
            where: { slug },
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
            ...product,
            sale_price: product.sale_price ?? 0,
            image: product.image ?? "",
            gallery: product.gallery ?? [],
            ratings: product.ratings ?? 0,
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        throw new Error('Failed to fetch product');
    }
}

export async function getAvailableShop() {
    try {
        const shops = await db.shop.findMany({
            where: { status: 'Approved' },
            select: {
                id: true,
                shopName: true,
                slug: true,
                logo: true,
                description: true,
                user: true,
                orders: true,
                products: true
            },
        });

        return shops;
    } catch (error) {
        console.error("Error fetching available shops:", error);
        throw new Error('Failed to fetch available shops');
    }
}

export async function getRelatedProducts(slug: string) {
    try {
        const product = await db.product.findFirst({
            where: { slug },
            include: { categories: true },
        });

        if (!product) {
            throw new Error('Product not found');
        }

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

export async function getFrequentlyBought(slug: string) {
    try {
        const products = await db.product.findMany({
            where: { status: 'Published' },
            take: 4,
            orderBy: {
                total_reviews: 'desc',
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