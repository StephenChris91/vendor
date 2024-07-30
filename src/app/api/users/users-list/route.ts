import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const userIds = await db.user.findMany({
            select: { id: true }
        });
        return NextResponse.json(userIds);
    } catch (error) {
        console.error('Error fetching user IDs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}