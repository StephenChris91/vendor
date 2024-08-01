'use server'

// actions/products/getProducts.ts

import { db } from "../../../prisma/prisma";


export async function getAllProducts(page: number = 1, pageSize: number = 28) {
    const skip = (page - 1) * pageSize;

    try {
        console.log(`Fetching products: page ${page}, pageSize ${pageSize}`);

        const [products, total] = await Promise.all([
            db.product.findMany({
                skip,
                take: pageSize,
                where: {
                    status: 'Published',
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    sale_price: true,
                    image: true,
                    gallery: true,
                    ratings: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            db.product.count({
                where: {
                    status: 'Published',
                },
            }),
        ]);

        console.log(`Fetched ${products.length} products out of ${total} total`);

        const totalPages = Math.ceil(total / pageSize);

        return {
            products: products.map(product => ({
                ...product,
                sale_price: product.sale_price ?? 0,
                image: product.image ?? "",
                gallery: product.gallery ?? [],
                ratings: product.ratings ?? 0,
            })),
            meta: {
                page,
                pageSize,
                total,
                totalPage: totalPages,
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : String(error)}`);
    }
}