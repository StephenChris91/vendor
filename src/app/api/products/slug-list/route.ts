// app/api/products/slug-list/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const slugs = await db.product.findMany({
            select: {
                slug: true,
            },
        });

        return NextResponse.json(slugs);
    } catch (error) {
        console.error('Error fetching product slugs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}