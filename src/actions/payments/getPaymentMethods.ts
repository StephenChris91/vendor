// app/actions/getPaymentMethods.ts
"use server"

import { useCurrentSession } from "@lib/use-session-server";
import { db } from "../../../prisma/prisma";




export async function getPaymentMethods() {
    try {
        console.log("Starting getPaymentMethods");
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            console.log("No authenticated user found");
            return { error: 'User not authenticated' };
        }

        console.log("Fetching payment methods for user:", session.user.id);
        const paymentMethods = await db.paymentMethod.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                cardNumber: true,
                cardHolderName: true,
                expirationDate: true,
                isDefault: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        console.log("Found payment methods:", paymentMethods.length);

        const serializedMethods = paymentMethods.map(method => ({
            ...method,
            id: method.id.toString(),
            createdAt: method.createdAt.toISOString(),
            updatedAt: method.updatedAt.toISOString(),
        }));

        console.log("Serialized payment methods");
        return { paymentMethods: serializedMethods };
    } catch (error) {
        console.error("Failed to fetch payment methods:", error);
        return { error: 'Failed to fetch payment methods: ' + (error instanceof Error ? error.message : String(error)) };
    }
}