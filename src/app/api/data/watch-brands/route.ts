import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const opticsBrands = await db.brand.findMany({
            where: { category: 'Optics' },
        });
        return NextResponse.json(opticsBrands);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch optics brands' }, { status: 500 });
    }
}