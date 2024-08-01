// app/actions/editAddress.ts
"use server"

import { CustomerAddress } from "@prisma/client";
import { db } from "../../../prisma/prisma";

type EditAddressInput = Omit<CustomerAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export async function editAddress(addressId: string, addressData: EditAddressInput): Promise<CustomerAddress> {
    try {
        const updatedAddress = await db.customerAddress.update({
            where: { id: addressId },
            data: addressData,
        });
        return updatedAddress;
    } catch (error) {
        console.error("Failed to update address:", error);
        throw new Error("Failed to update address. Please try again later.");
    }
}