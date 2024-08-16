import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    console.log('New arrivals route hit');
    try {
        const newArrivals = await db.product.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        console.log('New arrivals fetched:', newArrivals);
        return NextResponse.json(newArrivals);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        return NextResponse.json({ error: 'Failed to fetch new arrivals' }, { status: 500 });
    }
}