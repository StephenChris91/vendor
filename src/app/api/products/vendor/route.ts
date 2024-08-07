// app/api/vendor/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { useCurrentSession } from '@lib/use-session-server';
import { db } from '../../../../../prisma/prisma';


export async function GET(request: NextRequest) {
    try {
        const session = await useCurrentSession()

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const vendorId = session.user.id;

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        const skip = (page - 1) * pageSize;

        // Fetch the vendor's shop
        const shop = await db.shop.findUnique({
            where: { userId: vendorId },
            select: { id: true }
        });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        // Fetch orders for this shop
        const orders = await db.order.findMany({
            where: { shopId: shop.id },
            include: {
                orderItems: true,
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' }
        });

        const total = await db.order.count({
            where: { shopId: shop.id }
        });

        return NextResponse.json({
            orders,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching vendor orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}