// src/store/cartStore.ts

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Types
export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    shopId: string;
}

export interface ShippingAddress {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface ShippingRate {
    carrier_name: string;
    amount: number;
    currency: string;
    vendorId: string;
}

// Atoms
export const cartItemsAtom = atomWithStorage<CartItem[]>('cartItems', []);
export const shippingAddressAtom = atomWithStorage<ShippingAddress | null>('shippingAddress', null);
export const selectedShippingRatesAtom = atomWithStorage<Record<string, ShippingRate>>('selectedShippingRates', {});

// Derived atoms
export const cartTotalAtom = atom((get) => {
    const items = get(cartItemsAtom);
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

export const cartItemCountAtom = atom((get) => {
    const items = get(cartItemsAtom);
    return items.reduce((count, item) => count + item.quantity, 0);
});

export const totalShippingCostAtom = atom((get) => {
    const selectedRates = get(selectedShippingRatesAtom);
    return Object.values(selectedRates).reduce((total, rate) => total + rate?.amount, 0);
});

export const totalWithShippingAtom = atom((get) => {
    const cartTotal = get(cartTotalAtom);
    const totalShipping = get(totalShippingCostAtom);
    return cartTotal + totalShipping;
});

// Actions
export const addToCartAtom = atom(
    null,
    (get, set, newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        const currentItems = get(cartItemsAtom);
        const existingItemIndex = currentItems.findIndex(item => item.id === newItem.id);

        if (existingItemIndex > -1) {
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            set(cartItemsAtom, updatedItems);
        } else {
            set(cartItemsAtom, [...currentItems, { ...newItem, quantity: newItem.quantity || 1 }]);
        }
    }
);

export const removeFromCartAtom = atom(
    null,
    (get, set, itemId: string) => {
        console.log('Removing item from cart:', itemId);
        const currentItems = get(cartItemsAtom);
        console.log('Current items:', currentItems);
        const updatedItems = currentItems.filter(item => item.id !== itemId);
        console.log('Updated items:', updatedItems);
        set(cartItemsAtom, updatedItems);

        // Remove shipping rate for vendor if no items left
        const removedItem = currentItems.find(item => item.id === itemId);
        if (removedItem) {
            const vendorItems = updatedItems.filter(item => item.shopId === removedItem.shopId);
            if (vendorItems.length === 0) {
                set(selectedShippingRatesAtom, (prev) => {
                    const updated = { ...prev };
                    delete updated[removedItem.shopId];
                    return updated;
                });
            }
        }
    }
);

export const updateCartItemQuantityAtom = atom(
    null,
    (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
        const currentItems = get(cartItemsAtom);
        const updatedItems = currentItems.map(item =>
            item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0);
        set(cartItemsAtom, updatedItems);

        // Remove shipping rate for vendor if no items left
        const removedItem = currentItems.find(item => item.id === itemId && item.quantity > 0 && quantity === 0);
        if (removedItem) {
            const vendorItems = updatedItems.filter(item => item.shopId === removedItem.shopId);
            if (vendorItems.length === 0) {
                set(selectedShippingRatesAtom, (prev) => {
                    const updated = { ...prev };
                    delete updated[removedItem.shopId];
                    return updated;
                });
            }
        }
    }
);

export const clearCartAtom = atom(
    null,
    (get, set) => {
        set(cartItemsAtom, []);
        set(selectedShippingRatesAtom, {});
    }
);

export const setShippingAddressAtom = atom(
    null,
    (get, set, address: ShippingAddress) => {
        set(shippingAddressAtom, address);
    }
);

export const setShippingRateAtom = atom(
    null,
    (get, set, { vendorId, rate }: { vendorId: string; rate: ShippingRate | null }) => {
        set(selectedShippingRatesAtom, (prev) => ({
            ...prev,
            [vendorId]: rate
        }));
    }
);

// Order management
export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    shippingAddress: ShippingAddress;
    shippingRates: Record<string, ShippingRate>;
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: Date;
}

export const ordersAtom = atomWithStorage<Order[]>('orders', []);

export const createOrderAtom = atom(
    null,
    async (get, set) => {
        const cartItems = get(cartItemsAtom);
        const shippingAddress = get(shippingAddressAtom);
        const shippingRates = get(selectedShippingRatesAtom);
        const totalAmount = get(totalWithShippingAtom);

        if (cartItems.length === 0) {
            throw new Error('Cart is empty');
        }

        if (!shippingAddress) {
            throw new Error('Shipping address is not set');
        }

        // Here you would typically make an API call to create the order
        // For this example, we'll just create it locally
        const newOrder: Order = {
            id: Date.now().toString(), // In a real app, this would come from the backend
            userId: 'user-id', // This should be the actual user ID
            items: cartItems,
            shippingAddress,
            shippingRates,
            totalAmount,
            status: 'Pending',
            createdAt: new Date(),
        };

        set(ordersAtom, (prevOrders) => [...prevOrders, newOrder]);
        set(cartItemsAtom, []); // Clear the cart
        set(shippingAddressAtom, null); // Clear the shipping address
        set(selectedShippingRatesAtom, {}); // Clear the selected shipping rates

        return newOrder;
    }
);

export const getOrderByIdAtom = atom(
    null,
    (get, set, orderId: string) => {
        const orders = get(ordersAtom);
        return orders.find(order => order.id === orderId);
    }
);

export const updateOrderStatusAtom = atom(
    null,
    (get, set, { orderId, status }: { orderId: string; status: Order['status'] }) => {
        set(ordersAtom, (prevOrders) =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        );
    }
);