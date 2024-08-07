// lib/inventory.ts

import { db } from "../../../prisma/prisma";


interface CartItem {
    id: string;
    quantity: number;
}

interface InventoryCheckResult {
    success: boolean;
    error?: string;
    unavailableItems?: Array<{ id: string; name: string; availableQuantity: number }>;
}

export async function validateInventory(cartItems: CartItem[]): Promise<InventoryCheckResult> {
    try {
        const unavailableItems = [];

        for (const item of cartItems) {
            const product = await db.product.findUnique({
                where: { id: item.id },
                select: { id: true, name: true, stock: true }
            });

            if (!product) {
                throw new Error(`Product not found: ${item.id}`);
            }

            if (product.stock < item.quantity) {
                unavailableItems.push({
                    id: product.id,
                    name: product.name,
                    availableQuantity: product.stock
                });
            }
        }

        if (unavailableItems.length > 0) {
            return {
                success: false,
                error: 'Some items are out of stock or have insufficient quantity',
                unavailableItems
            };
        }

        return { success: true };
    } catch (error) {
        console.error('Error validating inventory:', error);
        throw new Error('Failed to validate inventory');
    }
}

export async function updateInventory(cartItems: CartItem[]): Promise<void> {
    try {
        for (const item of cartItems) {
            await db.product.update({
                where: { id: item.id },
                data: { stock: { decrement: item.quantity } }
            });
        }
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw new Error('Failed to update inventory');
    }
}