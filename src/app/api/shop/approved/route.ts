// app/api/product/shops/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const availableShops = await db.shop.findMany({
            where: {
                status: 'Approved', // Only get approved shops
            },
            include: {
                products: true,
            },
        });

        return NextResponse.json(availableShops);
    } catch (error) {
        console.error('Error fetching available shops:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}