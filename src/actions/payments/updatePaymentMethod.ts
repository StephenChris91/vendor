// app/actions/updatePaymentMethod.ts
"use server"

import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../prisma/prisma';


export async function updatePaymentMethod(id: string, isDefault: boolean) {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { success: false, error: 'User not authenticated' };
        }

        // If setting as default, unset all other payment methods as default
        if (isDefault) {
            await db.paymentMethod.updateMany({
                where: {
                    userId: session.user.id,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }

        const paymentMethod = await prisma.paymentMethod.updateMany({
            where: {
                id: id,
                userId: session.user.id,
            },
            data: {
                isDefault: isDefault,
            },
        });

        if (paymentMethod.count === 0) {
            return { success: false, error: 'Payment method not found or not owned by user' };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to update payment method:", error);
        return { success: false, error: 'Failed to update payment method' };
    }
}