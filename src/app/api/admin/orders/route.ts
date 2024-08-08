// app/api/admin/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';
import { OrderStatus } from '@models/order.model';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const paymentStatus = searchParams.get('paymentStatus') as OrderStatus | null;
    const fulfillmentStatus = searchParams.get('fulfillmentStatus') as OrderStatus | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const orders = await db.order.findMany({
            where: {
                AND: [
                    search
                        ? {
                            OR: [
                                { id: { contains: search, mode: 'insensitive' } },
                                { user: { name: { contains: search, mode: 'insensitive' } } },
                            ],
                        }
                        : {},
                    paymentStatus ? { status: paymentStatus } : {},
                    fulfillmentStatus ? { status: fulfillmentStatus } : {},
                    startDate ? { createdAt: { gte: new Date(startDate) } } : {},
                    endDate ? { createdAt: { lte: new Date(endDate) } } : {},
                ],
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                orderItems: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedOrders = orders.map((order) => ({
            id: order.id,
            customerName: order.user?.name ?? 'Unknown',
            orderDate: order.createdAt.toISOString(),
            totalAmount: order.totalPrice,
            paymentStatus: order.status,
            fulfillmentStatus: order.status, // Adjust this based on your schema
        }));

        return NextResponse.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
