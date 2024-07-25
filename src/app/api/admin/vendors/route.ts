// app/api/admin/vendors/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET(request: Request) {
    console.log("Vendors API route called");
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const status = searchParams.get('status');

        console.log("Search params:", { search, status });

        const vendors = await db.user.findMany({
            where: {
                role: 'Vendor',
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                    ],
                }),
                ...(status && { isOnboardedVendor: status === 'active' }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isOnboardedVendor: true,
                shop: {
                    select: {
                        id: true,
                        products: {
                            select: {
                                price: true,
                            },
                        },
                    },
                },
            },
        });

        console.log(`Found ${vendors.length} vendors`);

        const formattedVendors = vendors.map(vendor => ({
            id: vendor.id,
            name: vendor.name || 'N/A',
            email: vendor.email,
            registrationDate: vendor.createdAt.toISOString().split('T')[0],
            status: vendor.isOnboardedVendor ? 'active' : 'inactive',
            totalSales: vendor.shop?.products?.reduce((sum, product) => sum + (product.price || 0), 0) || 0,
            productCount: vendor.shop?.products?.length || 0,
            rating: 0,
        }));

        console.log("Returning formatted vendors");
        return NextResponse.json(formattedVendors);
    } catch (error) {
        console.error('Error in vendors API route:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}