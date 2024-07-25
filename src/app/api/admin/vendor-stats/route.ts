// app/api/admin/vendor-stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const totalVendors = await db.user.count({
            where: { role: 'Vendor' },
        });

        const newVendors = await db.user.count({
            where: {
                role: 'Vendor',
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
                },
            },
        });

        const pendingApprovals = await db.user.count({
            where: {
                role: 'Vendor',
                isOnboardedVendor: false,
            },
        });

        // For average rating, you might want to implement a rating system
        const averageRating = 0;

        return NextResponse.json({
            totalVendors,
            newVendors,
            averageRating,
            pendingApprovals,
        });
    } catch (error) {
        console.error('Error fetching vendor statistics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}