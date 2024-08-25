// actions/updateVendorStatus.ts
"use server"

import { revalidatePath } from "next/cache";
import { db } from "../../prisma/prisma";

export async function updateVendorStatus(userId: string, newStatus: "active" | "inactive") {
    try {
        // First, fetch the user and their shop
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { shop: true },
        });

        // Check if the user has a shop
        if (!user || !user.shop) {
            throw new Error("The user has no shop.");
        }

        // if (!user.isOnboardedVendor) {
        //     throw new Error("The user is not an onboarded vendor.");
        // }

        // Update the user's status
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: {
                isOnboardedVendor: newStatus === "active"
            },
            include: { shop: true },
        });

        // Update the shop's status
        await db.shop.update({
            where: { id: updatedUser.shop.id },
            data: {
                status: newStatus === "active" ? "Approved" : "Rejected"
            },
        });

        // Revalidate the admin vendors path
        revalidatePath('/admin/vendors');

        return updatedUser;
    } catch (error) {
        console.error("Failed to update vendor status:", error);
        throw new Error(error);
    }
}
