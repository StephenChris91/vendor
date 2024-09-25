// actions/user.ts

'use server';

import { db } from "../../prisma/prisma";
import { revalidatePath } from "next/cache";

export async function updatePaymentStatus(userId: string) {
    if (!userId) {
        return { success: false, message: 'User ID is required' };
    }

    try {
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { hasPaid: true },
        });

        revalidatePath('/'); // Revalidate the path where this data is used

        return { success: true, message: 'Payment status updated successfully', user: updatedUser };
    } catch (error) {
        console.error('Error updating payment status:', error);
        return { success: false, message: 'Failed to update payment status' };
    }
}