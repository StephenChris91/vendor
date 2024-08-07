// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';


export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    try {
        const products = await db.product.findMany({
            take: pageSize,
            skip: (page - 1) * pageSize,
            include: {
                shop: true,
                user: true,
                categories: true,
            },
        });

        const totalProducts = await db.product.count();

        return NextResponse.json({
            products: products.map(product => ({
                ...product,
                shop_name: product.shop?.shopName || null,
                author_name: product.user?.name || null,
                categories: product.categories.map(category => category.name),
            })),
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}

