import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    try {
        const shop = await db.shop.findUnique({
            where: { slug: slug }
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