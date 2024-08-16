import { NextRequest, NextResponse } from 'next/server';
import { ProductStatus, ProductType, Prisma } from '@prisma/client';
import { db } from '../../../../../prisma/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const productId = params.id;

    if (!productId) {
        return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json();

        // Prepare the update data, only including fields that are provided
        const updateData: Prisma.productUpdateInput = {};

        if (body.name !== undefined) updateData.name = body.name;
        if (body.slug !== undefined) updateData.slug = body.slug;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.price !== undefined) updateData.price = parseInt(body.price);
        if (body.sale_price !== undefined) updateData.sale_price = parseInt(body.sale_price);
        if (body.sku !== undefined) updateData.sku = body.sku;
        if (body.quantity !== undefined) updateData.quantity = parseInt(body.quantity);
        if (body.in_stock !== undefined) updateData.in_stock = body.in_stock;
        if (body.is_taxable !== undefined) updateData.is_taxable = body.is_taxable;
        if (body.status !== undefined) updateData.status = body.status as ProductStatus;
        if (body.product_type !== undefined) updateData.product_type = body.product_type as ProductType;
        if (body.image !== undefined) updateData.image = body.image;
        if (body.ratings !== undefined) updateData.ratings = parseFloat(body.ratings);
        if (body.total_reviews !== undefined) updateData.total_reviews = parseInt(body.total_reviews);
        if (body.my_review !== undefined) updateData.my_review = body.my_review;
        if (body.in_wishlist !== undefined) updateData.in_wishlist = body.in_wishlist;
        if (body.shop_name !== undefined) updateData.shop_name = body.shop_name;
        if (body.stock !== undefined) updateData.stock = parseInt(body.stock);

        // Handle gallery update
        if (Array.isArray(body.gallery)) {
            updateData.gallery = body.gallery;
        }

        // Handle categories update
        if (Array.isArray(body.categories)) {
            updateData.categories = {
                set: [], // First, remove all existing categories
                connect: body.categories.map((categoryId: string) => ({ id: categoryId }))
            };
        }

        // Handle shop relation update
        if (body.shop_id) {
            updateData.shop = {
                connect: { id: body.shop_id }
            };
        }

        // Handle author relation update
        if (body.author_id) {
            updateData.user = {
                connect: { id: body.author_id }
            };
        }

        // Perform the update
        const updatedProduct = await db.product.update({
            where: { id: productId },
            data: updateData,
            include: {
                categories: true,
                shop: true,
                user: true,
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ message: 'A unique constraint would be violated on Product. (Likely duplicate slug)' }, { status: 400 });
            }
        }
        return NextResponse.json({ message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

// GET handler to fetch a single product
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const productId = params.id;

    if (!productId) {
        return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    try {
        const product = await db.product.findUnique({
            where: { id: productId },
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
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE handler to remove a product
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const productId = params.id;

    if (!productId) {
        return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    try {
        await db.product.delete({
            where: { id: productId },
        });

        return NextResponse.json({ message: 'Product successfully deleted' });
    } catch (error) {
        console.error('Error deleting product:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
            }
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}