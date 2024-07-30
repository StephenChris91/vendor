import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const categories = await db.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                // You can include more fields if needed
            }
        });

        return NextResponse.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}