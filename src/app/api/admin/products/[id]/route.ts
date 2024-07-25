// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await db.product.findUnique({
            where: { id: params.id },
            include: {
                shop: true,
                author: true,
                categories: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...product,
            shop_name: product.shop?.shopname || null,
            author_name: product.author?.name || null,
            categories: product.categories.map(category => category.name),
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updatedProduct = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                sale_price: body.sale_price,
                quantity: body.quantity,
                status: body.status,
                product_type: body.product_type,
                shop: body.shop_id ? { connect: { id: body.shop_id } } : undefined,
                author: body.author_id ? { connect: { id: body.author_id } } : undefined,
                categories: {
                    set: body.category_ids?.map((id: string) => ({ id })) || [],
                },
            },
            include: {
                shop: true,
                author: true,
                categories: true,
            },
        });
        return NextResponse.json({
            ...updatedProduct,
            shop_name: updatedProduct.shop?.shopname || null,
            author_name: updatedProduct.author?.name || null,
            categories: updatedProduct.categories.map(category => category.name),
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.product.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
    }
}