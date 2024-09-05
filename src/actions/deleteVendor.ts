// app/actions/deleteVendor.ts
'use server'

import { db } from "../../prisma/prisma"


export async function deleteVendorAndRelatedData(vendorId: string) {
    try {
        // First, find the shop associated with the vendor
        const shop = await db.shop.findUnique({
            where: { userId: vendorId },
            select: { id: true }
        })

        if (shop) {
            // Delete all shopOrders associated with this shop
            await db.shopOrder.deleteMany({
                where: { shopId: shop.id }
            })
        }

        // Now delete the user (vendor)
        const deletedUser = await db.user.delete({
            where: { id: vendorId },
        })

        console.log(`Vendor ${deletedUser.id} and all related data have been deleted`)
        return { success: true, message: 'Vendor deleted successfully' };
    } catch (error) {
        console.error('Error deleting vendor:', error)
        return { success: false, message: 'Failed to delete vendor' };
    }
}