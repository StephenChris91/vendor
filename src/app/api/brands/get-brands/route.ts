// app/api/categories/get-categories/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';


export async function GET() {
    try {
        const brands = await db.brand.findMany();
        return NextResponse.json(brands);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}