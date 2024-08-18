// app/api/vendor/products/route.ts

import { useCurrentSession, useCurrentUser } from '@lib/use-session-server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const user = await useCurrentUser();

    if (!user || user.role !== "Vendor") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '28');
    const skip = (page - 1) * pageSize;

    try {
        const [products, totalCount] = await Promise.all([
            db.product.findMany({
                where: { user_id: user.id },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            db.product.count({ where: { user_id: user.id } }), // Change this line
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return NextResponse.json({
            products,
            meta: {
                page,
                pageSize,
                totalCount,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching vendor products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}