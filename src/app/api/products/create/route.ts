// app/api/products/route.ts
import { useCurrentSession } from '@lib/use-session-server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';


export async function POST(request: NextRequest) {
    try {
        const session = await useCurrentSession()
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const productData = await request.json();

        const newProduct = await db.product.create({
            data: {
                ...productData,
                user_id: session.user.id,
                // Ensure all required fields are provided or have default values
            },
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}