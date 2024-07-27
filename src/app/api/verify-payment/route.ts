// app/api/verifyPayment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { db } from '../../../../prisma/prisma';
import { useCurrentSession } from '@lib/use-session-server';

export async function POST(req: NextRequest) {
    const session = await useCurrentSession();

    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { reference } = body;

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        if (response.data.status === false) {
            return NextResponse.json(
                { message: response.data.message || "Payment verification failed" },
                { status: 400 }
            );
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
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json(
                { success: false, message: "Payment was not successful" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 });
    }
}