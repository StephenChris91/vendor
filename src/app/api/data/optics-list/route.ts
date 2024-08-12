import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const opticsList = await db.product.findMany({
            where: { category: 'Optics' },
        });
        return NextResponse.json(opticsList);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch optics list' }, { status: 500 });
    }
}