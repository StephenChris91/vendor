// app/api/products/check-slug/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
        return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    try {
        const existingProduct = await db.product.findUnique({
            where: { slug: slug },
            select: { id: true }
        });

        const isUnique = !existingProduct;

        return NextResponse.json({ isUnique });
    } catch (error) {
        console.error('Error checking slug uniqueness:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}