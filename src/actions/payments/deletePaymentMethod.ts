// app/actions/deletePaymentMethod.ts
"use server"

import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../prisma/prisma';


export async function deletePaymentMethod(id: string) {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { success: false, error: 'User not authenticated' };
        }

        const result = await db.paymentMethod.deleteMany({
            where: {
                id: id,
                userId: session.user.id,
            },
        });

        if (result.count === 0) {
            return { success: false, error: 'Payment method not found or not owned by user' };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to delete payment method:", error);
        return { success: false, error: 'Failed to delete payment method' };
    }
}