// app/api/admin/vendors/[id]/status/route.ts
import { NextResponse } from 'next/server';
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