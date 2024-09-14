import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';
import { ProductStatus, ProductType } from '@prisma/client';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const product = await db.product.findUnique({
            where: { id: params.id },
            include: {
                shop: true,
                user: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                brand: true,
            },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...product,
            shop_name: product.shop?.shopName || null,
            author_name: product.user?.name || null,
            categories: product.categories.map(pc => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug
            })),
            brand: product.brand ? {
                id: product.brand.id,
                name: product.brand.name,
                slug: product.brand.slug
            } : null,
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
        console.log('Received update request for product:', params.id);
        console.log('Update data:', body);

        // Fetch the existing product
        const existingProduct = await db.product.findUnique({
            where: { id: params.id },
            include: {
                categories: true,
                brand: true,
            },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Prepare the update data
        const updateData: any = {};
        for (const [key, value] of Object.entries(body)) {
            if (value !== undefined) {
                updateData[key] = value;
            }
        }

        // Handle special cases
        if (body.status) {
            updateData.status = body.status as ProductStatus;
        }
        if (body.product_type) {
            updateData.product_type = body.product_type as ProductType;
        }
        if (body.shop_id) {
            updateData.shop = { connect: { id: body.shop_id } };
        }
        if (body.user_id) {
            updateData.user = { connect: { id: body.user_id } };
        }
        if (body.brandId) {
            updateData.brand = { connect: { id: body.brandId } };
        } else if (body.brandId === null) {
            updateData.brand = { disconnect: true };
        }
        if (body.categories) {
            updateData.categories = {
                deleteMany: {},
                create: body.categories.map((categoryId: string) => ({
                    category: { connect: { id: categoryId } }
                }))
            };
        }

        console.log('Prepared update data:', updateData);

        const updatedProduct = await db.product.update({
            where: { id: params.id },
            data: updateData,
            include: {
                shop: true,
                user: true,
                categories: {
                    include: {
                        category: true
                    }
                },
                brand: true,
            },
        });

        console.log('Product updated successfully:', updatedProduct);

        return NextResponse.json({
            ...updatedProduct,
            shop_name: updatedProduct.shop?.shopName || null,
            author_name: updatedProduct.user?.name || null,
            categories: updatedProduct.categories.map(pc => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug
            })),
            brand: updatedProduct.brand ? {
                id: updatedProduct.brand.id,
                name: updatedProduct.brand.name,
                slug: updatedProduct.brand.slug
            } : null,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({
            error: 'Error updating product',
            details: (error as Error).message
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await db.product.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: 'Error deleting product' }, { status: 500 });
    }
}