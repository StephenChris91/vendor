// app/api/paystack-webhook/route.ts

import { verifyPaystackTransaction } from '@lib/order/createPayment';
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';
import { sendNotifications } from 'actions/notifications';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const event = payload.event;

        if (event === 'charge.success') {
            const reference = payload.data.reference;
            const isVerified = await verifyPaystackTransaction(reference);

            if (isVerified) {
                // Find the order first
                const orderToUpdate = await db.order.findFirst({
                    where: { paymentReference: reference }
                });

                if (!orderToUpdate) {
                    console.error(`Order not found for reference: ${reference}`);
                    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
                }

                // Update order status
                const order = await db.order.update({
                    where: { id: orderToUpdate.id },
                    data: { status: 'Paid' },
                    include: {
                        shopOrders: {
                            include: {
                                orderItems: true,
                                shop: true
                            }
                        },
                        orderItems: true,
                        shippingAddress: true,
                        user: true
                    }
                });

                if (!order) {
                    console.error(`Order not found for reference: ${reference}`);
                    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
                }

                // Update shop order statuses
                await db.shopOrder.updateMany({
                    where: { orderId: order.id },
                    data: { status: 'Paid' }
                });

                // Reserve inventory
                await reserveInventory(order.shopOrders);

                // Prepare data for notifications
                const validShops = order.shopOrders.reduce((acc, so) => {
                    acc[so.shopId] = so.shop;
                    return acc;
                }, {});

                const itemsByShop = order.shopOrders.reduce((acc, so) => {
                    acc[so.shopId] = so.orderItems;
                    return acc;
                }, {});

                // Send notifications
                await sendNotifications(
                    order.id,
                    order.user.email,
                    validShops,
                    order.orderItems,
                    order.totalPrice,
                    { reference },
                    itemsByShop
                );

                return NextResponse.json({ status: 'success' }, { status: 200 });
            } else {
                console.error(`Payment verification failed for reference: ${reference}`);
                return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
            }
        }

        return NextResponse.json({ status: 'ignored' }, { status: 200 });
    } catch (error) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function reserveInventory(shopOrders: any[]) {
    for (const shopOrder of shopOrders) {
        for (const orderItem of shopOrder.orderItems) {
            await db.product.update({
                where: { id: orderItem.productId },
                data: {
                    quantity: {
                        decrement: orderItem.quantity
                    }
                }
            });
        }
    }
}