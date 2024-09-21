import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const moreItems = await db.product.findMany({
            take: 8,
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(moreItems);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch more items' }, { status: 500 });
    }
}