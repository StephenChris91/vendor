// app/api/admin/customers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userRole } from '@prisma/client';
import { db } from '../../../../../prisma/prisma';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role') as userRole | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    try {
        const customers = await db.user.findMany({
            where: {
                AND: [
                    search
                        ? {
                            OR: [
                                { name: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } },
                            ],
                        }
                        : {},
                    role ? { role: role } : {},
                    startDate ? { createdAt: { gte: new Date(startDate) } } : {},
                    endDate ? { createdAt: { lte: new Date(endDate) } } : {},
                ],
            },
            include: {
                orders: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const formattedCustomers = customers.map((customer) => ({
            id: customer.id,
            name: customer.name || '',
            email: customer.email,
            registrationDate: customer.createdAt.toISOString(),
            totalOrders: customer.orders.length,
            totalSpent: customer.orders.reduce((sum, order) => sum + order.totalPrice, 0),
            role: customer.role,
        }));

        return NextResponse.json(formattedCustomers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}