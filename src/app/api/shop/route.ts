import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';

export async function GET() {
    try {
        const shops = await db.shop.findMany(
            { include: { shopSettings: true, address: true, paymentInfo: true } }
        )

        return NextResponse.json(shops);
    } catch (error) {
        console.error('Error fetching shops:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}