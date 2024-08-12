import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const brands = await db.brand.findMany({
            orderBy: { rating: 'desc' },
            take: 10,
        });
        return NextResponse.json(brands);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch top rated brands' }, { status: 500 });
    }
}