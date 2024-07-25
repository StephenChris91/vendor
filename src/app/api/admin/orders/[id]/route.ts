// app/api/admin/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const orderId = params.id;

    if (!orderId) {
        return NextResponse.json({ message: 'Order ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json();

        const updatedOrder = await db.order.update({
            where: { id: orderId },
            data: {
                status: body.paymentStatus, // Assuming status field covers both payment and fulfillment status
                // Add any other fields you want to update
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                orderItems: true,
            },
        });

        const formattedOrder = {
            id: updatedOrder.id,
            customerName: updatedOrder.user.name,
            orderDate: updatedOrder.createdAt.toISOString(),
            totalAmount: updatedOrder.totalPrice,
            paymentStatus: updatedOrder.status,
            fulfillmentStatus: updatedOrder.status, // Adjust if you have a separate field for this
        };

        return NextResponse.json(formattedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}