import { auth } from "auth";
import axios from "axios";
import { db } from "../../prisma/prisma";

interface PaymentConfig {
    email: string;
    amount: number;
    reference: string;
}

interface PaymentResponse {
    status: boolean;
    message: string;
    data?: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export async function initializePayment(config: PaymentConfig): Promise<PaymentResponse> {
    const { email, amount, reference } = config;
    const session = await auth();

    if (!session?.user?.id) {
        return {
            status: false,
            message: "User not authenticated",
        };
    }

    try {
        const response = await axios.post<PaymentResponse>(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount: amount * 100, // Convert to kobo
                reference,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.data.status) {
            return {
                status: false,
                message: response.data.message || "Payment initialization failed",
            };
        }

        // We'll update the user's payment status after successful verification, not here
        return response.data;
    } catch (error) {
        console.error("Payment initialization error:", error);
        return {
            status: false,
            message: "An error occurred while initializing payment",
        };
    }
}





export async function verifyPayment(reference: string): Promise<boolean> {
    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status && response.data.data.status === 'success') {
            // Extract the user ID from the reference
            const userId = reference.split('-')[1]; // Assuming the reference format is REF-userId-timestamp

            // Update the user's payment status and reference
            await db.user.update({
                where: { id: userId },
                data: {
                    hasPaid: true,
                    paymentReference: reference,
                },
            });

            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        throw new Error("An error occurred while verifying payment");
    }
}