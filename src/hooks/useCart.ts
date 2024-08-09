// src/hooks/useCart.ts

import { useAtom } from 'jotai';
import {
    cartItemsAtom,
    cartTotalAtom,
    addToCartAtom,
    removeFromCartAtom,
    updateCartItemQuantityAtom,
    CartItem
} from '../store/cartStore';

interface UseCartReturn {
    cartItems: CartItem[];
    cartTotal: number;
    addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeFromCart: (id: string) => void;
    updateCartItemQuantity: (params: { itemId: string; quantity: number }) => void;
}

export function useCart(): UseCartReturn {
    const [cartItems] = useAtom(cartItemsAtom);
    const [cartTotal] = useAtom(cartTotalAtom);
    const [, addToCart] = useAtom(addToCartAtom);
    const [, removeFromCart] = useAtom(removeFromCartAtom);
    const [, updateCartItemQuantity] = useAtom(updateCartItemQuantityAtom);

    return {
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartItemQuantity
    };
}