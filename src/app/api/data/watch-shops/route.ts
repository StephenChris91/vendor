import { db } from "../../../../../prisma/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const opticsShops = await db.shop.findMany({
            where: {
                category: {
                    name: 'Optics',
                }
            },
        });
        return NextResponse.json(opticsShops);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch optics shops' }, { status: 500 });
    }
}