// utils/fetchCities.ts

import axios from 'axios';

interface City {
    name: string;
    countryCode: string;
    stateCode: string;
    latitude: string;
    longitude: string;
}

export async function fetchCities(countryCode: string, stateCode: string): Promise<City[]> {
    try {
        const response = await axios.get(`${process.env.NODE_ENV !== "production" ? process.env.NEXT_PUBLIC_TERMINAL_DEV_URL! : process.env.TERMINAL_LIVE_URL}/cities`, {
            params: { country_code: countryCode, state_code: stateCode },
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TERMINAL_TEST_API_KEY!}`
            }
        });

        if (response.data.status && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
}