import { useCurrentSession } from '@lib/use-session-server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    try {
        const session = await useCurrentSession()
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const order = await db.order.findUnique({
            where: {
                id: id,
                userId: session.user.id
            },
            include: { orderItems: true }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}