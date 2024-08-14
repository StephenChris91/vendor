// hooks/useShippingRates.ts
import { useState, useCallback } from 'react';
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
    const [aggregatedRates, setAggregatedRates] = useState<AggregatedShippingRate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { cartItems, setShippingRate } = useCart();
    const [selectedShippingRates, setSelectedShippingRates] = useAtom(selectedShippingRatesAtom);

    const aggregateRates = (rates: ShippingRate[]): AggregatedShippingRate[] => {
        const aggregated = rates.reduce((acc, rate) => {
            const key = `${rate.carrier_name}-${rate.currency}`;
            if (acc[key]) {
                acc[key].amount += rate.amount;
                acc[key].vendor_rates[rate.vendorId] = rate.amount;
            } else {
                acc[key] = {
                    carrier_name: rate.carrier_name,
                    currency: rate.currency,
                    amount: rate.amount,
                    vendor_rates: { [rate.vendorId]: rate.amount }
                };
            }
            return acc;
        }, {} as Record<string, AggregatedShippingRate>);

        return Object.values(aggregated);
    };

    const getShippingRates = useCallback(async (user: User, vendors: { id: string }[], address: any) => {
        setIsLoading(true);
        setError(null);

        try {
            const pickupAddresses = await getOrCreatePickupAddresses(vendors);
            const deliveryAddressId = await createDeliveryAddress(user, address);
            const parcelId = await createParcel(cartItems);

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
    }, [cartItems, setShippingRate, selectedShippingRates]);

    return { individualRates, aggregatedRates, isLoading, error, getShippingRates };
};