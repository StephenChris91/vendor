import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const shopId = params.id;

    try {
        const shop = await db.shop.findUnique({
            where: {
                id: shopId,
            },
            include: {
                shopSettings: true,
                address: true,
                paymentInfo: true,
            },
        });

        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        return NextResponse.json(shop);
    } catch (error) {
        console.error('Error fetching shop:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}