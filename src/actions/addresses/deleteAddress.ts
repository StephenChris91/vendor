// app/actions/deleteAddress.ts
"use server"

import { db } from "../../../prisma/prisma";


export async function deleteAddress(addressId: string): Promise<void> {
    try {
        await db.customerAddress.delete({
            where: { id: addressId },
        });
    } catch (error) {
        console.error("Failed to delete address:", error);
        throw new Error("Failed to delete address. Please try again later.");
    }
}