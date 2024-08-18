// app/api/vendor/orders/route.ts

import { useCurrentSession } from '@lib/use-session-server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const session = await useCurrentSession();

    if (!session || session.user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const skip = (page - 1) * pageSize;

    try {
        const [orders, totalCount] = await Promise.all([
            db.shopOrder.findMany({
                where: { shop: { userId: session.user.id } },
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
                },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            db.shopOrder.count({ where: { shop: { userId: session.user.id } } }),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return NextResponse.json({
            orders,
            meta: {
                page,
                pageSize,
                totalCount,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching vendor orders:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}