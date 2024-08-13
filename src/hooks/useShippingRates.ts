import { currency } from '@utils/utils';
// hooks/useShippingRates.ts
import { useState, useCallback } from 'react';
import { getOrCreatePickupAddresses, createDeliveryAddress, createParcel, fetchShippingRates } from 'hooks/terminal';
import { useCart } from 'hooks/useCart';
import User from '@models/user.model';
import { useAtom } from 'jotai';
import { selectedShippingRateAtom } from '../store/cartStore';

interface ShippingRate {
    amount: number;
    carrier_name: string;
    currency: string
}

export const useShippingRates = () => {
    const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cartItems, setShippingRate } = useCart();
    const [selectedShippingRate, setSelectedShippingRate] = useAtom(selectedShippingRateAtom);

    const getShippingRates = useCallback(async (user: User, vendors: any[], address: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const pickupAddresses = await getOrCreatePickupAddresses(vendors);
            const deliveryAddressId = await createDeliveryAddress(user, address);
            const parcelId = await createParcel(cartItems);

            const ratesPromises = pickupAddresses.map(({ addressId }) =>
                fetchShippingRates(addressId, deliveryAddressId, parcelId)
            );

            const allRates = await Promise.all(ratesPromises);
            const combinedRates = allRates.flat().sort((a, b) => a.amount - b.amount);

            setShippingRates(combinedRates);

            if (combinedRates.length > 0 && !selectedShippingRate) {
                setShippingRate(combinedRates[0]);
            }
        } catch (err) {
            console.error('Error fetching shipping rates:', err);
            setError('Failed to fetch shipping rates');
        } finally {
            setIsLoading(false);
        }
    }, [cartItems, setShippingRate, selectedShippingRate]);

    return { shippingRates, isLoading, error, getShippingRates };
};