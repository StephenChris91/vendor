
import { NextRequest, NextResponse } from 'next/server'
import { db } from "../../../../../../prisma/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const newProduct = await db.product.create({
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
                status: body.status,
                product_type: body.product_type,
                image: body.image,
                gallery: body.gallery,
                isFlashDeal: body.isFlashDeal,
                discountPercentage: body.discountPercentage,
                shop: body.shop_id ? { connect: { id: body.shop_id } } : undefined,
                user: body.user_id ? { connect: { id: body.user_id } } : undefined,
                brand: body.brandId ? { connect: { id: body.brandId } } : undefined,
                categories: {
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
            ...newProduct,
            shop_name: newProduct.shop?.shopName || null,
            author_name: newProduct.user?.name || null,
            categories: newProduct.categories.map(pc => ({
                id: pc.category.id,
                name: pc.category.name,
                slug: pc.category.slug
            })),
            brand: newProduct.brand ? {
                id: newProduct.brand.id,
                name: newProduct.brand.name,
                slug: newProduct.brand.slug
            } : null,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Error creating product' }, { status: 500 });
    }
}