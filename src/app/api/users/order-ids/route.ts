export const dynamic = 'force-dynamic'; // Add this line to mark the route as dynamic


import { useCurrentSession } from '@lib/use-session-server';
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';


export async function GET() {
    try {
        const session = await useCurrentSession()
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orderIds = await db.order.findMany({
            where: { userId: session.user.id },
            select: { id: true }
        });
        return NextResponse.json(orderIds);
    } catch (error) {
        console.error('Error fetching order IDs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}