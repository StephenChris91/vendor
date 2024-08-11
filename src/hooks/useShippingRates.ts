import { useState, useCallback, useMemo } from 'react';
import { useCart } from 'hooks/useCart';

interface ShippingRate {
    carrier_name: string;
    amount: number;
    currency: string;
}

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
}

interface CartItem {
    id: string;
    quantity: number;
    price: number;
    // Add other necessary properties
}

export const useShippingRates = () => {
    const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
    const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cartItems, cartTotal } = useCart();

    const getShippingRates = useCallback(async (user: User, vendors: any[], address: any) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Fetching shipping rates for:', { user, vendors, address });

            // Here you would typically call your API function to get shipping rates
            // For example:
            // const rates = await fetchShippingRatesFromAPI(user, vendors, address);
            // setShippingRates(rates);

            // For demonstration, we'll use the fallback rate
            const fallbackRate = calculateFallbackShippingRate(cartItems);
            const rates = [
                {
                    carrier_name: 'Standard Shipping',
                    amount: fallbackRate,
                    currency: 'NGN'
                },
                {
                    carrier_name: 'Express Shipping',
                    amount: fallbackRate * 1.5,
                    currency: 'NGN'
                }
            ];
            setShippingRates(rates);
            setSelectedRate(rates[0]); // Automatically select the first rate

        } catch (err) {
            console.error('Error fetching shipping rates:', err);
            const fallbackRate = calculateFallbackShippingRate(cartItems);
            const rates = [{
                carrier_name: 'Standard Shipping',
                amount: fallbackRate,
                currency: 'NGN'
            }];
            setShippingRates(rates);
            setSelectedRate(rates[0]);
            setError('Unable to fetch accurate shipping rates. Using estimated rate.');
        } finally {
            setIsLoading(false);
        }
    }, [cartItems]);

    const selectShippingRate = useCallback((rate: ShippingRate) => {
        setSelectedRate(rate);
    }, []);

    const total = useMemo(() => {
        return cartTotal + (selectedRate?.amount || 0);
    }, [cartTotal, selectedRate]);

    return {
        shippingRates,
        selectedRate,
        isLoading,
        error,
        getShippingRates,
        selectShippingRate,
        total
    };
};

function calculateFallbackShippingRate(cartItems: CartItem[]): number {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const baseRate = 1500; // Base rate in Naira
    const perItemRate = 100; // Additional rate per item
    return baseRate + (totalItems * perItemRate);
}