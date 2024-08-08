// lib/payments.ts

import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!;
const PAYSTACK_API_URL = 'https://api.paystack.co';

interface PaystackTransactionResult {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
}

export async function initializePaystackTransaction(
    amount: number,
    email: string,
    currency: string = 'NGN'
): Promise<PaystackTransactionResult> {
    try {
        const response = await axios.post(
            `${PAYSTACK_API_URL}/transaction/initialize`,
            {
                amount: Math.round(amount * 100), // Paystack expects amount in kobo (smallest currency unit)
                email,
                currency,
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const { data } = response.data;

        return {
            authorizationUrl: data.authorization_url,
            accessCode: data.access_code,
            reference: data.reference,
        };
    } catch (error) {
        console.error('Error initializing Paystack transaction:', error);
        throw new Error('Failed to initialize payment');
    }
}

export async function verifyPaystackTransaction(reference: string): Promise<boolean> {
    try {
        const response = await axios.get(
            `${PAYSTACK_API_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        const { data } = response.data;

        // Check if the transaction was successful
        if (data.status === 'success') {
            return true;
        } else {
            console.warn(`Payment not successful. Status: ${data.status}`);
            return false;
        }
    } catch (error) {
        console.error('Error verifying Paystack transaction:', error);
        throw new Error('Failed to verify payment');
    }
}