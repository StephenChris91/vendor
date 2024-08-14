'use server'

import Shop from "@models/shop.model";
import { db } from "../../../prisma/prisma";

export type PartialShop = {
    id: string;
    shopName: string;
    slug: string;
    logo: string;
    description: string;
    user?: {
        id: string;
        name: string;
    };
    orders?: {
        id: string;
    }[];
    products?: {
        id: string;
        name: string;
    }[];
};

export async function getAvailableShop(): Promise<PartialShop[]> {
    try {
        const shops = await db.shop.findMany({
            where: { status: 'Approved' },
            select: {
                id: true,
                shopName: true,
                slug: true,
                logo: true,
                description: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                orders: {
                    select: {
                        id: true,
                    }
                },
                products: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
        });

        return shops.map(shop => ({
            id: shop.id,
            shopName: shop.shopName,
            slug: shop.slug,
            logo: shop.logo,
            description: shop.description,
            user: shop.user ? {
                id: shop.user.id,
                name: shop.user.name,
            } : undefined,
            orders: shop.orders?.map(order => ({
                id: order.id,
            })),
            products: shop.products?.map(product => ({
                id: product.id,
                name: product.name,
            })),
        }));
    } catch (error) {
        console.error("Error fetching available shops:", error);
        throw new Error('Failed to fetch available shops');
    }
}
