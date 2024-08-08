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

        });

        return shops;
    } catch (error) {
        console.error("Failed to fetch available shops:", error);
        throw new Error('Failed to fetch available shops');
    }
}