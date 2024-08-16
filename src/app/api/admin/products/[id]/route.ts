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
        const updatedProduct = await db.product.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                price: body.price,
                sale_price: body.sale_price,
                sku: body.sku,
                quantity: body.quantity,
                in_stock: body.in_stock,
                is_taxable: body.is_taxable,
                status: body.status as ProductStatus,
                product_type: body.product_type as ProductType,
                image: body.image,
                gallery: body.gallery,
                isFlashDeal: body.isFlashDeal,
                discountPercentage: body.discountPercentage,
                shop: body.shop_id ? { connect: { id: body.shop_id } } : undefined,
                user: body.user_id ? { connect: { id: body.user_id } } : undefined,
                brand: body.brandId ? { connect: { id: body.brandId } } : { disconnect: true },
                categories: {
                    deleteMany: {},
                    create: body.categories.map((categoryId: string) => ({
                        category: { connect: { id: categoryId } }
                    }))
                },
            },
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
        return NextResponse.json({ error: 'Error updating product' }, { status: 500 });
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