import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const newArrivals = await db.product.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        return NextResponse.json(newArrivals);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch new arrivals' }, { status: 500 });
    }
}