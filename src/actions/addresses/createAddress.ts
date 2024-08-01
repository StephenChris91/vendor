// app/actions/createAddress.ts
"use server"

import { useCurrentSession } from '@lib/use-session-server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';


const prisma = new PrismaClient();

type AddressInput = {
    title: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    phone?: string;
    isDefault: boolean;
};

export async function createAddress(data: AddressInput) {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { success: false, error: 'User not authenticated' };
        }

        const address = await prisma.customerAddress.create({
            data: {
                ...data,
                userId: session.user.id,
            },
        });

        revalidatePath('/addresses');

        return { success: true, address };
    } catch (error) {
        console.error("Failed to create address:", error);
        return { success: false, error: 'Failed to create address' };
    }
}