// app/api/products/[id]/route.ts
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

        // Prepare the update data
        const updateData: Prisma.productUpdateInput = {
            name: body.name,
            slug: body.slug,
            description: body.description,
            price: parseInt(body.price),
            sale_price: parseInt(body.sale_price),
            sku: body.sku,
            quantity: parseInt(body.quantity),
            in_stock: body.in_stock,
            is_taxable: body.is_taxable,
            status: body.status as ProductStatus,
            product_type: body.product_type as ProductType,
            video: body.video,
            image: body.image,
            ratings: body.ratings ? parseFloat(body.ratings) : undefined,
            total_reviews: body.total_reviews ? parseInt(body.total_reviews) : undefined,
            my_review: body.my_review,
            in_wishlist: body.in_wishlist,
            shop_name: body.shop_name,
            stock: body.stock ? parseInt(body.stock) : undefined,
        };

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
            updateData.author = {
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
                author: true,
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
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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
                author: true,
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