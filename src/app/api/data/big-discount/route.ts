import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const mobileProducts = await db.product.findMany({
            where: { category: 'Mobile' },
        });
        return NextResponse.json(mobileProducts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch mobile list' }, { status: 500 });
    }
}