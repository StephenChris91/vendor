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

// Atoms
export const cartItemsAtom = atomWithStorage<CartItem[]>('cartItems', []);
export const shippingAddressAtom = atomWithStorage<ShippingAddress | null>('shippingAddress', null);

// Derived atoms
export const cartTotalAtom = atom((get) => {
    const items = get(cartItemsAtom);
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

export const cartItemCountAtom = atom((get) => {
    const items = get(cartItemsAtom);
    return items.reduce((count, item) => count + item.quantity, 0);
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
        const currentItems = get(cartItemsAtom);
        set(cartItemsAtom, currentItems.filter(item => item.id !== itemId));
    }
);

export const updateCartItemQuantityAtom = atom(
    null,
    (get, set, { itemId, quantity }: { itemId: string; quantity: number }) => {
        const currentItems = get(cartItemsAtom);
        const updatedItems = currentItems.map(item =>
            item.id === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
        );
        set(cartItemsAtom, updatedItems.filter(item => item.quantity > 0));
    }
);

export const clearCartAtom = atom(
    null,
    (get, set) => {
        set(cartItemsAtom, []);
    }
);

export const setShippingAddressAtom = atom(
    null,
    (get, set, address: ShippingAddress) => {
        set(shippingAddressAtom, address);
    }
);

// Order management
export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    shippingAddress: ShippingAddress;
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
        const totalAmount = get(cartTotalAtom);

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
            totalAmount,
            status: 'Pending',
            createdAt: new Date(),
        };

        set(ordersAtom, (prevOrders) => [...prevOrders, newOrder]);
        set(cartItemsAtom, []); // Clear the cart
        set(shippingAddressAtom, null); // Clear the shipping address

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