// app/api/admin/vendors/route.ts

export const dynamic = 'force-dynamic'; // Mark the route as dynamic

import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
    console.log("Vendors API route called");
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const status = searchParams.get('status');

        console.log("Search params:", { search, status });

        const where: Prisma.userWhereInput = {
            role: 'Vendor',
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
            ...(status && { isOnboardedVendor: status === 'active' }),
        };

        const vendors = await db.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                isOnboardedVendor: true,
                shop: {
                    select: {
                        id: true,
                        shopName: true,
                        shopOrders: {
                            where: {
                                status: 'Complete',
                            },
                            select: {
                                totalPrice: true,
                            },
                        },
                        products: {
                            select: {
                                rating: true,
                            },
                        },
                    },
                },
            },
        });

        console.log(`Found ${vendors.length} vendors`);

        const formattedVendors = vendors.map(vendor => {
            const totalSales = vendor.shop?.shopOrders.reduce((sum, order) => sum + order.totalPrice, 0) || 0;
            const productCount = vendor.shop?.products.length || 0;

            // Calculate average rating for each product, then average those
            const productRatings = vendor.shop?.products.map(product => {
                if (Array.isArray(product.rating)) {
                    // If rating is an array of rating objects
                    return product.rating.reduce((sum, r) => sum + r.rating, 0) / product.rating.length;
                } else if (typeof product.rating === 'number') {
                    // If rating is already a number
                    return product.rating;
                }
                return 0;
            }) || [];

            const averageRating = productRatings.length > 0
                ? productRatings.reduce((sum, rating) => sum + rating, 0) / productRatings.length
                : 0;

            return {
                id: vendor.id,
                name: vendor.name || 'N/A',
                email: vendor.email,
                shop: vendor.shop || 'N/A',
                registrationDate: vendor.createdAt.toISOString().split('T')[0],
                status: vendor.isOnboardedVendor ? 'active' : 'inactive',
                totalSales: totalSales,
                productCount: productCount,
                rating: Number(averageRating.toFixed(1)),
            };
        });

        console.log("Returning formatted vendors");
        return NextResponse.json(formattedVendors);
    } catch (error) {
        console.error('Error in vendors API route:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: 'Database Error', details: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}