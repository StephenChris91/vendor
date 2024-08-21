// hooks/useShippingRates.ts
import { useState, useCallback, useMemo } from 'react';
import { getOrCreatePickupAddresses, createDeliveryAddress, createParcel, fetchShippingRates } from 'hooks/terminal';
import { useCart } from 'hooks/useCart';
import User from '@models/user.model';
import { useAtom } from 'jotai';
import { selectedShippingRatesAtom, ShippingRate } from '../store/cartStore';

interface AggregatedShippingRate {
    carrier_name: string;
    currency: string;
    amount: number; // This is the total amount
    vendor_rates: Record<string, number>;
}

export const useShippingRates = () => {
    const [individualRates, setIndividualRates] = useState<ShippingRate[]>([]);
    const [aggregatedRates, setAggregatedRates] = useState<AggregatedShippingRate[]>([]); // Initialize with empty array
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cartItems, setShippingRate } = useCart();
    const [selectedShippingRates] = useAtom(selectedShippingRatesAtom);

    const memoizedCartItems = useMemo(() => cartItems, [cartItems]);

    const aggregateRates = useCallback((rates: ShippingRate[]): AggregatedShippingRate[] => {
        const aggregated: Record<string, AggregatedShippingRate> = {};

        rates.forEach((rate) => {
            const key = `${rate.carrier_name}-${rate.currency}`;
            if (key in aggregated) {
                aggregated[key].amount += rate.amount;
                aggregated[key].vendor_rates[rate.vendorId] = rate.amount;
            } else {
                aggregated[key] = {
                    carrier_name: rate.carrier_name,
                    currency: rate.currency,
                    amount: rate.amount,
                    vendor_rates: { [rate.vendorId]: rate.amount }
                };
            }
        });

        return Object.values(aggregated);
    }, []);

    const getShippingRates = useCallback(async (user: User, vendors: { id: string }[], address: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const pickupAddresses = await getOrCreatePickupAddresses(vendors);
            const deliveryAddressId = await createDeliveryAddress(user, address);
            const parcelId = await createParcel(memoizedCartItems);

            const ratesPromises = pickupAddresses.map(({ addressId, vendorId }) =>
                fetchShippingRates(addressId, deliveryAddressId, parcelId).then(rates =>
                    rates.map(rate => ({ ...rate, vendorId }))
                )
            );

            const allRates = await Promise.all(ratesPromises);
            const combinedRates = allRates.flat();

            setIndividualRates(combinedRates);
            setAggregatedRates(aggregateRates(combinedRates));

            // Set default shipping rate for each vendor if not already set
            vendors.forEach(vendor => {
                if (!selectedShippingRates[vendor.id]) {
                    const vendorRates = combinedRates.filter(rate => rate.vendorId === vendor.id);
                    if (vendorRates.length > 0) {
                        setShippingRate({ vendorId: vendor.id, rate: vendorRates[0] });
                    }
                }
            });
        } catch (err) {
            console.error('Error fetching shipping rates:', err);
            setError('Failed to fetch shipping rates');
        } finally {
            setIsLoading(false);
        }
    }, [memoizedCartItems, setShippingRate, selectedShippingRates, aggregateRates]);

    return { individualRates, aggregatedRates, isLoading, error, getShippingRates };
};