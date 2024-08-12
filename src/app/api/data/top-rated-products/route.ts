import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const products = await db.product.findMany({
            orderBy: { ratings: 'desc' },
            take: 10,
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch top rated products' }, { status: 500 });
    }
}