import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const oldestShops = await db.shop.findMany({
            select: {
                id: true,
                shopName: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
            take: 5,
        });

        return NextResponse.json(oldestShops);
    } catch (error) {
        console.error('Error fetching oldest shops:', error);
        return NextResponse.json({ message: 'Error fetching oldest shops' }, { status: 500 });
    }
}