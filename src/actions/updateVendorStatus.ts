// actions/updateVendorStatus.ts
"use server"

import { revalidatePath } from "next/cache";
import { db } from "../../prisma/prisma";


export async function updateVendorStatus(userId: string, newStatus: "active" | "inactive") {
    try {
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                isOnboardedVendor: newStatus === "active"
            },
            include: { shop: true },
        });

        // If the user has a shop, you might want to update its status as well
        if (updatedUser.shop) {
            await db.shop.update({
                where: { id: updatedUser.shop.id },
                data: {
                    status: newStatus === "active" ? "Approved" : "Rejected"
                },
            });
        }

        revalidatePath('/admin/vendors')
        return updatedUser;
    } catch (error) {
        console.error("Failed to update vendor status:", error);
        throw new Error("Failed to update vendor status");
    }
}