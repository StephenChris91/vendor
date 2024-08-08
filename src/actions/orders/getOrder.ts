// app/actions/getOrder.ts
"use server"

import { useCurrentSession } from "@lib/use-session-server";
import { db } from "../../../prisma/prisma";
import { Order, OrderStatus } from "../../models/order.model";

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
            ...order,
            id: order.id.toString(),
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            status: order.status as OrderStatus,
            orderItems: order.orderItems.map(item => ({
                ...item,
                id: item.id.toString(),
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString(),
            })),
        };

        return { order: formattedOrder };
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return { error: 'Failed to fetch order' };
    }
}