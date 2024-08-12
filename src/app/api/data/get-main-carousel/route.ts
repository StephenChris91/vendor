import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const mainCarousel = await db.mainCarousel.findMany();
        return NextResponse.json(mainCarousel);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch main carousel' }, { status: 500 });
    }
}