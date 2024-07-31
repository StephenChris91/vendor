import { useState, useCallback } from 'react';
import { getOrCreatePickupAddresses, createDeliveryAddress, createParcel, fetchShippingRates } from 'hooks/terminal';
import User from '@models/user.model';

export const useShippingRates = () => {
    const [shippingRates, setShippingRates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getShippingRates = useCallback(async (user, cartItems, vendors, address) => {
        setIsLoading(true);
        setError(null);

        try {
            const pickupAddresses = await getOrCreatePickupAddresses(vendors);
            const deliveryAddressId = await createDeliveryAddress(user, address);
            const parcelId = await createParcel(cartItems);

            console.log('Pickup Addresses:', pickupAddresses);
            console.log('Delivery Address ID:', deliveryAddressId);
            console.log('Parcel ID:', parcelId);

            const ratesPromises = pickupAddresses.map(({ addressId }) =>
                fetchShippingRates(addressId, deliveryAddressId, parcelId)
            );

            const allRates = await Promise.all(ratesPromises);
            console.log('All Rates:', allRates);

            // Combine and sort rates from all vendors
            const combinedRates = allRates
                .flat()
                .sort((a, b) => a.amount - b.amount);

            console.log('Combined Rates:', combinedRates);
            setShippingRates(combinedRates);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching shipping rates:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { shippingRates, isLoading, error, getShippingRates };
};