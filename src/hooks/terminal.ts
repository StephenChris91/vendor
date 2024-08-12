import User from "@models/user.model";
import { formatPhoneNumber } from "utils/phoneUtils";

const API_KEY = "sk_test_nfkFJs8y9KARbAEfIzxZC4DBwpFE6Hcr";
const API_URL = 'https://sandbox.terminal.africa/v1';

async function makeRequest(endpoint: string, method: string, body: any = null) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

export async function createPickupAddress(vendor: any) {
    console.log('Creating pickup address for vendor:', vendor);

    // Ensure phone number is in international format
    const formattedPhone = formatPhoneNumber(vendor.phone);
    if (!formattedPhone) {
        throw new Error(`Invalid phone number for vendor ${vendor.id}`);
    }

    const body = {
        first_name: vendor.name.split(' ')[0] || '',
        last_name: vendor.name.split(' ').slice(1).join(' ') || '',
        email: vendor.email,
        phone: formattedPhone,
        line1: vendor.address.street,
        city: vendor.address.city,
        state: vendor.address.state as string,
        country: 'NG', // Assuming all vendors are in Nigeria
        shop_id: vendor.id
    };

    try {
        const response = await makeRequest('/addresses', 'POST', body);
        console.log('Pickup address created:', response);
        return response.data.address_id; // Return the correct address_id
    } catch (error) {
        console.error(`Error creating pickup address for vendor ${vendor.id}:`, error);
        throw error;
    }
}

export async function getOrCreatePickupAddresses(vendors: any[]) {
    console.log('Getting or creating pickup addresses for vendors:', vendors);

    if (!vendors || vendors.length === 0) {
        console.error('No vendors provided to getOrCreatePickupAddresses');
        return [];
    }

    const pickupAddresses = await Promise.all(vendors.map(async (vendor) => {
        try {
            console.log('Processing vendor:', vendor);

            // First, try to fetch an existing address for the vendor
            const response = await makeRequest(`/addresses?shop_id=${vendor.id}`, 'GET');
            console.log('Fetch existing address response:', response);

            if (response.data && response.data.length > 0) {
                // If an address exists, return it
                console.log('Existing address found for vendor:', vendor.id);
                return { vendorId: vendor.id, addressId: response.data[0].address_id };
            } else {
                // If no address exists, create a new one
                console.log('Creating new address for vendor:', vendor.id);
                const addressId = await createPickupAddress(vendor);
                console.log('New address created:', addressId);
                return { vendorId: vendor.id, addressId };
            }
        } catch (error) {
            console.error(`Error processing vendor ${vendor.id}:`, error);
            return null; // Return null for failed vendors
        }
    }));

    const validPickupAddresses = pickupAddresses.filter(address => address !== null);
    console.log('Valid pickup addresses:', validPickupAddresses);

    return validPickupAddresses
}

export async function createDeliveryAddress(user: User, address: any) {
    const body = {
        first_name: user.firstname,
        last_name: user.lastname,
        email: user.email,
        phone: user.phone || '+2348083669100', // Fallback to a default if user.phone is not available
        line1: address.street,
        city: address.city,
        state: address.state,
        country: 'NG',
    };

    console.log('Creating delivery address with:', body);

    const response = await makeRequest('/addresses', 'POST', body);
    console.log('Delivery address response:', response);
    return response.data.address_id as string; // Return the correct address_id
}

export async function createParcel(cartItems: any[]) {
    const totalWeight = cartItems.reduce((sum, item) => {
        const itemWeight = Math.max(item.weight || 0.1, 0.1) * item.quantity;
        return sum + itemWeight;
    }, 0);

    const largestItem = cartItems.reduce((largest, item) => {
        return (item.dimensions?.length || 0) > (largest.dimensions?.length || 0) ? item : largest;
    }, cartItems[0]);

    const body = {
        weight: Math.max(totalWeight, 0.1), // Ensure total weight is at least 0.1 kg
        weight_unit: 'kg',
        length: largestItem.dimensions?.length || 10,
        width: largestItem.dimensions?.width || 10,
        height: largestItem.dimensions?.height || 10,
        dimension_unit: 'cm',
        description: 'Package containing ordered items',
        items: cartItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            value: item.price,
            description: item.description || 'Product description',
            weight: Math.max(item.weight || 0.1, 0.1), // Ensure each item weighs at least 0.1 kg
            weight_unit: 'kg',
            currency: item.currency || 'NGN'
        })),
    };

    const response = await makeRequest('/parcels', 'POST', body);
    return response.data.parcel_id as string;
}

export async function fetchShippingRates(
    pickupAddressId: string,
    deliveryAddressId: string,
    parcelId: string,
    cashOnDelivery: boolean = true,
    currency: string = 'NGN'
) {
    const queryParams = new URLSearchParams({
        pickup_address: pickupAddressId,
        delivery_address: deliveryAddressId,
        parcel_id: parcelId,
        cash_on_delivery: cashOnDelivery.toString(),
        currency: currency
    });

    console.log('Fetching shipping rates with params:', queryParams.toString());

    try {
        const response = await makeRequest(`/rates/shipment?${queryParams.toString()}`, 'GET');
        console.log('Shipping rates response:', response);
        return response.data;
    } catch (error) {
        console.error('Error fetching shipping rates:', error);
        throw error;
    }
}