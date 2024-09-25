// app/api/payment/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("Received payload at /api/payment:", body); // Log the received body to check for userId and transactionRef

        const { userId, transactionRef } = body;

        if (!userId) {
            console.error("Validation Error: User ID is missing.");
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        if (!transactionRef) {
            console.error("Validation Error: Transaction Reference is missing.");
            return NextResponse.json({ message: 'Transaction Reference is required' }, { status: 400 });
        }

        // Here you might want to verify the transaction with Paystack's API before updating the status
        // For simplicity, we're assuming the transaction is valid

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { hasPaid: true },
        });

        console.log("User payment status updated:", updatedUser);

        return NextResponse.json({ message: 'Payment status updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json({ message: 'Error updating payment status' }, { status: 500 });
    }
}
