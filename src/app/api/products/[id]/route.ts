// /app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/actions/products';
import { db } from '@/prisma/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const product = await db.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
