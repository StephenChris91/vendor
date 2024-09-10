// actions/user.ts

'use server';

import { db } from "../../prisma/prisma";


export const updatePaymentStatus = async (userId: string): Promise<{ success: boolean; message: string; user?: any }> => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { hasPaid: true },
        });

        return { success: true, message: 'Payment status updated successfully', user: updatedUser };
    } catch (error) {
        console.error('Error updating payment status:', error);
        return { success: false, message: 'Failed to update payment status' };
    }
}