import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';

export async function GET() {
    try {
        const shops = await db.shop.findMany();
        return NextResponse.json(shops);
    } catch (error) {
        console.error('Error fetching shops:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}