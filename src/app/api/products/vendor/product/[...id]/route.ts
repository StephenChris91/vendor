import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../../prisma/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const productId = params.id;

    if (!productId) {
        return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    try {
        // Ensure productId is a string
        const product = await db.product.findUnique({
            where: { id: String(productId) },
            include: {
                categories: true,
                shop: true,
                user: true,
            },
        });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}