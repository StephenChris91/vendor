// app/api/vendor-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';
import { useCurrentSession } from '@lib/use-session-server';


export async function GET(request: NextRequest) {
    try {
        // Get the session to check if the user is authenticated and is a vendor
        const session = await useCurrentSession();


        const vendorId = session.user.id;

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        // Calculate skip for pagination
        const skip = (page - 1) * pageSize;

        // Fetch products for the specific vendor
        const products = await db.product.findMany({
            where: { user_id: vendorId },
            skip,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: {
                categories: true,
                shop: {
                    select: {
                        shopName: true
                    }
                }
            }
        });

        // Get total count for pagination
        const total = await db.product.count({ where: { user_id: vendorId } });

        return NextResponse.json({
            result: products,
            meta: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching vendor products:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}