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

export async function verifyPaystackTransaction(reference: string): Promise<{ verified: boolean; message: string }> {
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

        if (data.status === 'success') {
            return { verified: true, message: 'Payment verified successfully' };
        } else {
            console.warn(`Payment not successful. Status: ${data.status}`);
            return { verified: false, message: `Payment verification failed. Status: ${data.status}` };
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.data.code === 'transaction_not_found') {
                return { verified: false, message: 'Transaction not found. The payment may not have been completed yet.' };
            }
            console.error('Paystack API error:', error.response.data);
            return { verified: false, message: error.response.data.message || 'Failed to verify payment' };
        } else {
            console.error('Error verifying Paystack transaction:', error);
            return { verified: false, message: 'An unexpected error occurred during payment verification' };
        }
    }
}