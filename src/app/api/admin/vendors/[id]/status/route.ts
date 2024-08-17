// app/api/admin/vendors/[id]/status/route.ts
import { useCurrentSession } from '@lib/use-session-server';
import { NextRequest, NextResponse } from 'next/server';
import { db } from 'prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { status } = await request.json();

    console.log(`Updating status for vendor ${id} to ${status}`);

    try {
        const updatedVendor = await db.user.update({
            where: { id },
            data: {
                isOnboardedVendor: status === 'active',
            },
        });

        console.log("Vendor status updated:", updatedVendor);

        return NextResponse.json({
            id: updatedVendor.id,
            status: updatedVendor.isOnboardedVendor ? 'active' : 'inactive',
        });
    } catch (error) {
        console.error('Error updating vendor status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { vendorId: string } }
) {
    try {
        // Check authentication and authorization
        const session = await useCurrentSession()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const vendorId = params.vendorId;

        // Perform the deletion
        await db.$transaction(async (prisma) => {
            // Delete related records first (adjust based on your schema)
            await prisma.product.deleteMany({ where: { userId: vendorId } });
            await prisma.shop.deleteMany({ where: { userId: vendorId } });

            // Delete the user (vendor)
            await prisma.user.delete({ where: { id: vendorId } });
        });

        return NextResponse.json({ message: 'Vendor deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting vendor:', error);
        return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
    }
}


