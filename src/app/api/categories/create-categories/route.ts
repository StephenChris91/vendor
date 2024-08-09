// app/api/categories/create-category/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, slug } = body;

        // Check if category already exists
        const existingCategory = await db.category.findUnique({
            where: {
                name,
            },
        });

        if (existingCategory) {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
        }

        const newCategory = await db.category.create({
            data: { name, slug },
        });

        return NextResponse.json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}
