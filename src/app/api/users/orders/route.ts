import { useCurrentSession } from '@lib/use-session-server';
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';


export async function GET() {
    try {
        const session = await useCurrentSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await db.order.findMany({
            where: { userId: session.user.id },
            include: { orderItems: true }
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}