import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const mobileShops = await db.shop.findMany({
            where: {
                category: 'mobile'
            },
        });
        return NextResponse.json(mobileShops);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch mobile shops' }, { status: 500 });
    }
}