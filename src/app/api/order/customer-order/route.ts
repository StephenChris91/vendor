import { NextResponse } from "next/server";
import { useCurrentSession } from "@lib/use-session-server";
import { OrderStatus } from "@models/order.model"; // Ensure this is a plain enum or object
import { db } from "../../../../../prisma/prisma";

export async function GET() {
    try {
        const session = await useCurrentSession();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
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

        return NextResponse.json({ orders: plainOrders }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}
