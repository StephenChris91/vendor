// @lib/order/inventory.ts

import { db } from '../../../prisma/prisma';

interface CartItem {
    id: string;
    quantity: number;
}

interface InventoryCheckResult {
    success: boolean;
    error?: string;
    outOfStockItems?: string[];
}

export async function validateInventory(cartItems: CartItem[]): Promise<InventoryCheckResult> {
    const outOfStockItems: string[] = [];

    for (const item of cartItems) {
        const product = await db.product.findUnique({
            where: { id: item.id },
            select: { id: true, name: true, quantity: true }
        });

        if (!product) {
            outOfStockItems.push(`Product with ID ${item.id} not found`);
        } else if (product.quantity < item.quantity) {
            outOfStockItems.push(product.name);
        }
    }

    if (outOfStockItems.length > 0) {
        return {
            success: false,
            error: 'Some items are out of stock or have insufficient quantity',
            outOfStockItems
        };
    }

    return { success: true };
}