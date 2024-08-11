import { NextResponse } from 'next/server';
import { auth } from 'auth';
import { validateInventory } from '@lib/order/inventory';
import { calculateTax } from '@lib/order/calculateTax';
import { calculateShipping } from '@lib/order/calculateShipping';
import { getUserByEmail } from '@lib/data/user';
import { useCurrentSession, useCurrentUser } from '@lib/use-session-server';
import { initializePaystackTransaction, verifyPaystackTransaction } from '@lib/order/createPayment';
import { db } from '../../../../../prisma/prisma';




export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.json({ error: 'Payment reference is required' }, { status: 400 });
    }

    try {
        const isVerified = await verifyPaystackTransaction(reference);

        if (isVerified) {
            // Update order status
            const order = await db.order.findFirst({
                where: { paymentReference: reference },
                include: {
                    shopOrders: {
                        include: {
                            orderItems: true
                        }
                    },
                    shippingAddress: true
                }
            });

            if (!order) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            await db.order.update({
                where: { id: order.id },
                data: { status: 'Paid' }
            });

            // Update shop order statuses
            for (const shopOrder of order.shopOrders) {
                await db.shopOrder.update({
                    where: { id: shopOrder.id },
                    data: { status: 'Paid' }
                });
            }

            return NextResponse.json({
                success: true,
                orderSummary: {
                    orderId: order.id,
                    totalAmount: order.totalPrice,
                    items: order.shopOrders.flatMap(so => so.orderItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })))
                }
            });
        } else {
            return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}