// app/api/order/[orderId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';
import { auth } from 'auth';

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        const session = await auth();
        console.log("Session:", session); // Add this line

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log("Searching for order:", params.orderId, "User ID:", session.user.id); // Add this line

        const order = await db.order.findUnique({
            where: {
                id: params.orderId,
                userId: session.user.id // Ensure the order belongs to the current user
            },
            include: {
                orderItems: true
            }
        });

        console.log("Found order:", order); // Add this line

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const orderSummary = {
            orderId: order.id,
            totalAmount: order.totalPrice,
            items: order.orderItems.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        return NextResponse.json(orderSummary);
    } catch (error) {
        console.error('Error fetching order details:', error);
        return NextResponse.json({ error: 'Failed to fetch order details', details: error.message }, { status: 500 });
    }
}