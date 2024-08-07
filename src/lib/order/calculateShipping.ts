// lib/calculations.ts

import { product } from '@prisma/client';

interface CartItem {
    product: product;
    quantity: number;
}

interface ShippingAddress {
    country: string;
    state: string;
    zipCode: string;
}

export async function calculateShipping(cartItems: CartItem[], shippingAddress: ShippingAddress): Promise<number> {
    try {
        // Placeholder flat rate shipping
        const BASE_SHIPPING_RATE = 10; // $10 base rate
        const PER_ITEM_RATE = 2; // $2 per item

        // Calculate based on number of items
        const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

        let shippingCost = BASE_SHIPPING_RATE + (PER_ITEM_RATE * itemCount);

        // Apply a surcharge for international shipping (assuming 'NG' is Nigeria)
        if (shippingAddress.country !== 'NG') {
            shippingCost *= 2; // Double the shipping cost for international orders
        }

        // Round to two decimal places
        return Math.round(shippingCost * 100) / 100;
    } catch (error) {
        console.error('Error calculating shipping:', error);
        throw new Error('Failed to calculate shipping');
    }
}