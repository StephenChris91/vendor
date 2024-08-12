import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const carBrands = await db.brand.findMany({
            where: { category: 'Car' },
        });
        return NextResponse.json(carBrands);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch car brands' }, { status: 500 });
    }
}