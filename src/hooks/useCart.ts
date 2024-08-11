// hooks/useCart.ts

import { useAtom } from 'jotai';
import {
    cartItemsAtom,
    cartTotalAtom,
    addToCartAtom,
    removeFromCartAtom,
    updateCartItemQuantityAtom,
    selectedShippingRateAtom,
    setShippingRateAtom,
    totalWithShippingAtom,
    fallbackShippingRateAtom,
    shippingAddressAtom,
    setShippingAddressAtom,
    CartItem,
    ShippingRate,
    ShippingAddress,
    clearCartAtom
} from '../store/cartStore';

export function useCart() {
    const [cartItems] = useAtom(cartItemsAtom);
    const [cartTotal] = useAtom(cartTotalAtom);
    const [selectedShippingRate] = useAtom(selectedShippingRateAtom);
    const [totalWithShipping] = useAtom(totalWithShippingAtom);
    const [fallbackShippingRate] = useAtom(fallbackShippingRateAtom);
    const [shippingAddress] = useAtom(shippingAddressAtom);
    const [, addToCart] = useAtom(addToCartAtom);
    const [, removeFromCart] = useAtom(removeFromCartAtom);
    const [, updateCartItemQuantity] = useAtom(updateCartItemQuantityAtom);
    const [, setShippingRate] = useAtom(setShippingRateAtom);
    const [, setShippingAddress] = useAtom(setShippingAddressAtom);
    const [, clearCart] = useAtom(clearCartAtom);


    return {
        cartItems,
        cartTotal,
        selectedShippingRate,
        totalWithShipping,
        fallbackShippingRate,
        shippingAddress,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        setShippingRate,
        setShippingAddress,
        clearCart
    };
}

// You might want to export these types if they're not already exported from cartStore
export type { CartItem, ShippingRate, ShippingAddress };