// lib/calculations.ts

import { db } from "../../../prisma/prisma";

export async function calculateTax(subtotal: number, state: string): Promise<number> {
    try {
        // Fetch the tax rate from the database
        const taxRate = await db.taxRate.findUnique({
            where: {
                state: state,
            }
        });

        if (!taxRate) {
            console.warn(`No tax rate found for ${state}, Nigeria`);
            return 0;
        }

        // Calculate tax
        const taxAmount = subtotal * (taxRate.rate / 100);

        // Round to two decimal places
        return Math.round(taxAmount * 100) / 100;
    } catch (error) {
        console.error('Error calculating tax:', error);
        throw new Error('Failed to calculate tax');
    }
}