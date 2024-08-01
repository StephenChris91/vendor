// app/actions/getAddresses.ts
"use server"

import { CustomerAddress } from "@prisma/client";
import { db } from "../../../prisma/prisma";

export async function getAddresses(userId: string): Promise<CustomerAddress[]> {
    try {
        const addresses = await db.customerAddress.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return addresses;
    } catch (error) {
        console.error("Failed to fetch addresses:", error);
        throw new Error("Failed to fetch addresses. Please try again later.");
    }
}