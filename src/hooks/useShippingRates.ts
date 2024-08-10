import { useState, useCallback } from 'react';
import { getOrCreatePickupAddresses, createDeliveryAddress, createParcel, fetchShippingRates } from 'hooks/terminal';
import { useCart } from 'hooks/useCart';
import User from '@models/user.model';

interface ShippingRate {
    amount: number;
    carrier_name: string;
    // Add other properties as needed
}

export const useShippingRates = () => {
    const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cartItems } = useCart();

    const getShippingRates = useCallback(async (user: User, vendors: any[], address: any) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log('Address received:', address);
            console.log('Vendors:', vendors);

            if (!vendors || vendors.length === 0) {
                throw new Error('No vendors found for the items in your cart.');
            }

            const pickupAddresses = await getOrCreatePickupAddresses(vendors);
            console.log('Pickup Addresses:', pickupAddresses);

            if (pickupAddresses.length === 0) {
                throw new Error('No valid pickup addresses found. Please ensure vendors have valid addresses and phone numbers.');
            }

            const deliveryAddress = {
                ...address,
                state: address.state?.label || address.state
            };
            console.log('Delivery address being sent:', deliveryAddress);

            const deliveryAddressId = await createDeliveryAddress(user, deliveryAddress);
            const parcelId = await createParcel(cartItems);

            console.log('Delivery Address ID:', deliveryAddressId);
            console.log('Parcel ID:', parcelId);

            const ratesPromises = pickupAddresses.map(({ addressId }) =>
                fetchShippingRates(addressId, deliveryAddressId, parcelId)
            );

            const allRates = await Promise.all(ratesPromises);
            console.log('All Rates:', allRates);

            const combinedRates = allRates
                .flat()
                .sort((a, b) => a.amount - b.amount);

            console.log('Combined Rates:', combinedRates);
            setShippingRates(combinedRates);
        } catch (err) {
            console.error('Detailed error:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred while fetching shipping rates.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [cartItems]);

    return { shippingRates, isLoading, error, getShippingRates };
};