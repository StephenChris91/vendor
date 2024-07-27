// app/api/initializePayment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { useCurrentSession } from '@lib/use-session-server';

export async function POST(req: NextRequest) {
    const session = await useCurrentSession();

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { email, amount, reference } = body;

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
            return NextResponse.json(
                { message: response.data.message || "Payment initialization failed" },
                { status: 400 }
            );
        }

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Paystack API error:", error);
        return NextResponse.json({ message: "Failed to initialize payment" }, { status: 500 });
    }
}