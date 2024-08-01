// app/actions/getOrders.ts
"use server"

import { useCurrentSession } from "@lib/use-session-server";
import { db } from "../../../prisma/prisma";



export async function getOrders() {
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

        return {
            orders: orders.map(order => ({
                ...order,
                id: order.id.toString(),
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                orderItems: order.orderItems.map(item => ({
                    ...item,
                    id: item.id.toString(),
                    createdAt: item.createdAt.toISOString(),
                    updatedAt: item.updatedAt.toISOString(),
                })),
            })),
        };
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return { error: 'Failed to fetch orders' };
    }
}