import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const mobileBrands = await db.brand.findMany({
            where: { category: 'Mobile' },
        });
        return NextResponse.json(mobileBrands);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch mobile brands' }, { status: 500 });
    }
}