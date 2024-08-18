// app/api/vendor/orders/[id]/route.ts

import { useCurrentSession } from '@lib/use-session-server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../../prisma/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await useCurrentSession();

    if (!session || session.user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = params.id;

    try {
        const order = await db.shopOrder.findFirst({
            where: {
                id: orderId,
                shop: { userId: session.user.id }
            },
            include: {
                order: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstname: true,
                                lastname: true,
                                email: true,
                            }
                        },
                        shippingAddress: true,
                    }
                },
                orderItems: {
                    include: {
                        product: true,
                    }
                },
                shop: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Error fetching order details:", error);
        return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }
}