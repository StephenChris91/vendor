// app/actions/getOrder.ts
"use server"

import { useCurrentSession } from "@lib/use-session-server";
import { db } from "../../../prisma/prisma";
import { Order, OrderStatus, OrderItem } from "../../models/order.model";

export async function getOrder(orderId: string): Promise<{ order: Order } | { error: string }> {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { error: 'User not authenticated' };
        }

        const order = await db.order.findUnique({
            where: {
                id: orderId,
                userId: session.user.id,
            },
            include: {
                orderItems: true,
            },
        });

        if (!order) {
            return { error: 'Order not found' };
        }

        const formattedOrder: Order = {
            id: order.id.toString(),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            status: order.status as OrderStatus,
            userId: order.userId,
            subtotal: order.subtotal,
            tax: order.tax,
            shippingCost: order.shippingCost,
            totalPrice: order.totalPrice,
            paymentIntentId: order.paymentIntentId || null,
            paymentMethod: order.paymentMethod,
            shopId: order.shopId,
            paymentReference: order.paymentReference || null,
            orderItems: order.orderItems.map(item => ({
                id: item.id.toString(),
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString(),
                orderId: item.orderId,
                shopOrderId: item.shopOrderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                sku: item.sku,
            })),
            // Populate the following fields
            items: order.orderItems, // This maps to the `CartItem[]` in your store
            shippingAddress: order?.shippingAddressId,
            shippingRates: [],
            totalAmount: order.totalPrice + 10, // Example logic, adjust as needed
        };

        return { order: formattedOrder };
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return { error: 'Failed to fetch order' };
    }
}
