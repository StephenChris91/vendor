import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const topCategories = await db.category.findMany({
            where: { isTopCategory: true },
        });
        return NextResponse.json(topCategories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch top categories' }, { status: 500 });
    }
}