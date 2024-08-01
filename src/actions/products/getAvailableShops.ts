// app/actions/shopActions.ts
"use server"

import { shop } from "@prisma/client";
import { db } from "../../../prisma/prisma";

export async function getAvailableShop(): Promise<Partial<shop>[]> {
    try {
        const shops = await db.shop.findMany({
            where: {
                status: 'Approved', // Assuming you have a status field and 'Approved' is a valid status
            },
            select: {
                id: true,
                shopName: true,
                description: true,
                logo: true,
                slug: true,
                user: true,
                products: true,
                orders: true
                // Add any other fields you need
            },
        });

        return shops;
    } catch (error) {
        console.error("Failed to fetch available shops:", error);
        throw new Error('Failed to fetch available shops');
    }
}