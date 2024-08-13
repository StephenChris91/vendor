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
    shippingAddressAtom,
    setShippingAddressAtom,
    clearCartAtom,
    CartItem,
    ShippingRate,
    ShippingAddress,
} from '../store/cartStore';

export function useCart() {
    const [cartItems] = useAtom(cartItemsAtom);
    const [cartTotal] = useAtom(cartTotalAtom);
    const [selectedShippingRate] = useAtom(selectedShippingRateAtom);
    const [totalWithShipping] = useAtom(totalWithShippingAtom);
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
        shippingAddress,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        setShippingRate,
        setShippingAddress,
        clearCart
    };
}

export type { CartItem, ShippingRate, ShippingAddress };