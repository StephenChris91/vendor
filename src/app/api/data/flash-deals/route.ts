import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const flashDeals = await db.product.findMany({
            where: { isFlashDeal: true },
        });
        return NextResponse.json(flashDeals);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch flash deals' }, { status: 500 });
    }
}