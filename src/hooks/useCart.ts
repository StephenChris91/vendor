// hooks/useCart.ts
import { useAtom } from 'jotai';
import {
    cartItemsAtom,
    cartTotalAtom,
    addToCartAtom,
    removeFromCartAtom,
    updateCartItemQuantityAtom,
    selectedShippingRatesAtom,
    setShippingRateAtom,
    totalWithShippingAtom,
    totalShippingCostAtom,
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
    const [selectedShippingRates] = useAtom(selectedShippingRatesAtom);
    const [totalWithShipping] = useAtom(totalWithShippingAtom);
    const [totalShippingCost] = useAtom(totalShippingCostAtom);
    const [shippingAddress] = useAtom(shippingAddressAtom);
    const [, addToCart] = useAtom(addToCartAtom);
    const [, removeFromCart] = useAtom(removeFromCartAtom);
    const [, updateCartItemQuantity] = useAtom(updateCartItemQuantityAtom);
    const [, setShippingRate] = useAtom(setShippingRateAtom);
    const [, setShippingAddress] = useAtom(setShippingAddressAtom);
    const [, clearCart] = useAtom(clearCartAtom);

    const getVendorIds = () => Array.from(new Set(cartItems.map(item => item.shopId)));

    const getVendorItems = (vendorId: string) => cartItems.filter(item => item.shopId === vendorId);

    const getVendorTotal = (vendorId: string) =>
        getVendorItems(vendorId).reduce((total, item) => total + item.price * item.quantity, 0);

    const getVendorShippingRate = (vendorId: string) => selectedShippingRates[vendorId] || null;

    return {
        cartItems,
        cartTotal,
        selectedShippingRates,
        totalWithShipping,
        totalShippingCost,
        shippingAddress,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        setShippingRate,
        setShippingAddress,
        clearCart,
        getVendorIds,
        getVendorItems,
        getVendorTotal,
        getVendorShippingRate
    };
}

export type { CartItem, ShippingRate, ShippingAddress };