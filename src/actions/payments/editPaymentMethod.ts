// app/actions/editPaymentMethod.ts
"use server"

import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../prisma/prisma';


type PaymentMethodInput = {
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvc: string;
    isDefault?: boolean;
};

export async function editPaymentMethod(id: string, data: PaymentMethodInput) {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { success: false, error: 'User not authenticated' };
        }

        const paymentMethod = await db.paymentMethod.updateMany({
            where: {
                id: id,
                userId: session.user.id,
            },
            data: data,
        });

        if (paymentMethod.count === 0) {
            return { success: false, error: 'Payment method not found or not owned by user' };
        }

        return { success: true, paymentMethod };
    } catch (error) {
        console.error("Failed to edit payment method:", error);
        return { success: false, error: 'Failed to edit payment method' };
    }
}