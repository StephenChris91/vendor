// app/api/update-payment-status/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';


export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { hasPaid: true },
        });

        return NextResponse.json({ message: 'Payment status updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json({ message: 'Error updating payment status' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}