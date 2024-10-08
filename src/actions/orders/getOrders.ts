"use server"

import { useCurrentSession } from "@lib/use-session-server";
import { db } from "../../../prisma/prisma";
import { OrderStatus } from "@models/order.model"; // Ensure this is a plain enum or object

export async function getOrders(): Promise<{ orders: any[] } | { error: string }> {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return { error: 'User not authenticated' };
        }

        const orders = await db.order.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                orderItems: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Ensure all items are plain objects
        const plainOrders = orders.map(order => ({
            ...order,
            id: order.id.toString(), // Convert BigInt to string
            createdAt: order.createdAt.toISOString(), // Convert Date to string
            updatedAt: order.updatedAt.toISOString(), // Convert Date to string
            status: order.status as OrderStatus, // Ensure status is a plain string or enum
            orderItems: order.orderItems.map(item => ({
                ...item,
                id: item.id.toString(), // Convert BigInt to string
                createdAt: item.createdAt.toISOString(), // Convert Date to string
                updatedAt: item.updatedAt.toISOString(), // Convert Date to string
            })),
        }));

        // Convert the orders to plain objects by serializing and deserializing
        return { orders: JSON.parse(JSON.stringify(plainOrders)) };
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return { error: 'Failed to fetch orders' };
    }
}
