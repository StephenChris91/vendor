'use server'

// actions/payment.ts

import { auth } from "auth";
import axios from "axios";
import { db } from "../../prisma/prisma";

interface PaymentConfig {
    email: string;
    amount: number;
    reference: string;
}

interface PaymentProps {
    config: PaymentConfig;
}

export const initializePayment = async ({ config }: PaymentProps) => {
    const { email, amount, reference } = config;
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }

    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, // Convert to kobo
                reference,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.status === false) {
            throw new Error(response.data.message || "Payment initialization failed");
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Paystack API error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to initialize payment");
        }
        throw error;
    }
};

export const verifyAndUpdatePayment = async (reference: string) => {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("User not authenticated");
    }

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status === false) {
            throw new Error(response.data.message || "Payment verification failed");
        }

        if (response.data.data.status === "success") {
            await db.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    hasPaid: true,
                },
            });
            return true;
        } else {
            return false;
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Payment verification error:", error.response?.data);
            throw new Error(error.response?.data?.message || "Failed to verify payment");
        }
        throw error;
    }
};