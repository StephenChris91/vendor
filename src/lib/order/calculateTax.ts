// Import necessary modules

import { db } from "../../../prisma/prisma";

// Default tax rate to use if a specific state's tax rate is not found
const DEFAULT_TAX_RATE = 0.05; // 5% default tax rate

export async function calculateTax(subtotal: number, state: string, shopId: string): Promise<number> {
    try {
        // Check if the state is provided
        if (!state) {
            // throw new Error('State is required to calculate tax');
            return subtotal * DEFAULT_TAX_RATE;
        }

        // Fetch the tax rate for the specified state and shop
        const taxRateData = await db.taxRate.findFirst({
            where: {
                state,
                id: shopId,
            },
        });

        // Use the found tax rate, or fallback to the default tax rate
        const taxRate = taxRateData?.rate || DEFAULT_TAX_RATE;

        // Calculate the tax amount
        return subtotal * taxRate;
    } catch (error) {
        console.error('Error calculating tax:', error);
        // If there's an error, return a default tax value to prevent the process from failing
        return subtotal * DEFAULT_TAX_RATE;
    }
}
