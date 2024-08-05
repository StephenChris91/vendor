// app/api/categories/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';





export async function POST(request: NextRequest) {
    try {
        const { name, slug } = await request.json();
        const newCategory = await db.category.create({
            data: { name, slug },
        });
        return NextResponse.json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}