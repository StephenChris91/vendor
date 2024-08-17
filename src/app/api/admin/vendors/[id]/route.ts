// app/api/admin/vendors/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

import { Prisma } from '@prisma/client';
import { useCurrentUser } from '@lib/use-session-server';
import { db } from '../../../../../../prisma/prisma';

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication and authorization
        const user = await useCurrentUser();
        if (!user || user.role !== 'Admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const vendorId = params.id;

        // Perform the deletion
        await db.$transaction(async (prisma) => {
            // Delete ProductCategory entries
            await prisma.productCategory.deleteMany({
                where: {
                    product: {
                        user_id: vendorId
                    }
                }
            });

            // Delete products
            await prisma.product.deleteMany({ where: { user_id: vendorId } });

            // Delete shop if exists
            const shop = await prisma.shop.findUnique({ where: { userId: vendorId } });
            if (shop) {
                await prisma.shop.delete({ where: { id: shop.id } });
            }

            // Delete cart if exists
            const cart = await prisma.cart.findUnique({ where: { userId: vendorId } });
            if (cart) {
                await prisma.cart.delete({ where: { id: cart.id } });
            }

            // Delete wishlist items
            await prisma.wishlist.deleteMany({ where: { userId: vendorId } });

            // Delete customer addresses
            await prisma.customerAddress.deleteMany({ where: { userId: vendorId } });

            // Delete payment methods
            await prisma.paymentMethod.deleteMany({ where: { userId: vendorId } });

            // Delete orders
            await prisma.order.deleteMany({ where: { userId: vendorId } });

            // Finally, delete the user (vendor)
            await prisma.user.delete({ where: { id: vendorId } });
        });

        return NextResponse.json({ message: 'Vendor deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return NextResponse.json({ error: `Database error: ${error.message}` }, { status: 500 });
        }
        return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
    }
}