import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string | string[] } }
) {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    console.log('Received request for shop with ID:', id);

    if (!id) {
        console.log('No ID provided');
        return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    try {
        console.log('Attempting to fetch shop from database');
        const shop = await db.shop.findUnique({
            where: { id: id },
            include: {
                shopSettings: true,
                address: true,
                products: true
            },
        });

        if (!shop) {
            console.log('No shop found with ID:', id);
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }

        console.log('Shop found:', shop);
        return NextResponse.json(shop);
    } catch (error) {
        console.error('Error fetching shop:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}