// app/actions/getAddress.ts
"use server"

import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../prisma/prisma';



export async function getAddress(addressId: string) {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            throw new Error('User not authenticated');
        }

        const address = await db.customerAddress.findUnique({
            where: {
                id: addressId,
                userId: session.user.id, // Ensure the address belongs to the current user
            },
        });

        if (!address) {
            throw new Error('Address not found');
        }

        return address;
    } catch (error) {
        console.error("Failed to fetch address:", error);
        throw error;
    }
}