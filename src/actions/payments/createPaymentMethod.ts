// app/actions/createPaymentMethod.ts
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

export async function createPaymentMethod(data: PaymentMethodInput) {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { success: false, error: 'User not authenticated' };
        }

        const paymentMethod = await db.paymentMethod.create({
            data: {
                ...data,
                userId: session.user.id,
            },
        });

        return { success: true, paymentMethod };
    } catch (error) {
        console.error("Failed to create payment method:", error);
        return { success: false, error: 'Failed to create payment method' };
    }
}