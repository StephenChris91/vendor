// app/api/admin/customers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userRole } from '@prisma/client';
import { db } from '../../../../../../prisma/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const customerId = params.id;

    if (!customerId) {
        return NextResponse.json({ message: 'Customer ID is required' }, { status: 400 });
    }

    try {
        const body = await request.json();

        const updatedCustomer = await db.user.update({
            where: { id: customerId },
            data: {
                name: body.name,
                email: body.email,
                role: body.role as userRole,
            },
            include: {
                orders: true,
            },
        });

        const formattedCustomer = {
            id: updatedCustomer.id,
            name: updatedCustomer.name || '',
            email: updatedCustomer.email,
            registrationDate: updatedCustomer.createdAt.toISOString(),
            totalOrders: updatedCustomer.orders.length,
            totalSpent: updatedCustomer.orders.reduce((sum, order) => sum + order.totalPrice, 0),
            role: updatedCustomer.role,
        };

        return NextResponse.json(formattedCustomer);
    } catch (error) {
        console.error('Error updating customer:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}