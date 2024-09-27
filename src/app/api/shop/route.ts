export const dynamic = 'force-dynamic';


import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const shops = await db.shop.findMany({
            where: { status: 'Approved' },
            include: {
                shopSettings: true,
                address: true,
            },
        });

        revalidatePath('/shops')
        return NextResponse.json(shops, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });

    } catch (error) {
        console.error('Error fetching shops:', error);
        return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
    }
}