// utils/fetchCities.ts

interface City {
    name: string;
    countryCode: string;
    stateCode: string;
    latitude: string;
    longitude: string;
}

const API_KEY = "sk_test_nfkFJs8y9KARbAEfIzxZC4DBwpFE6Hcr";
const LIVE_API_KEY = "sk_live_xOj87IrfMM8wTfVvjsMsSWeHZYTy2siT"
const API_URL = 'https://sandbox.terminal.africa/v1';
const TERMINAL_LIVE_URL = "https://api.terminal.africa/v1";

async function makeRequest(endpoint: string, method: string, body: any = null) {
    const response = await fetch(`${process.env.NODE_ENV !== "production" ? API_URL : TERMINAL_LIVE_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NODE_ENV !== "production" ? API_KEY : LIVE_API_KEY}`
        },
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

export async function fetchCities(countryCode: string, stateCode: string): Promise<City[]> {
    try {
        const endpoint = `/cities?country_code=${countryCode}&state_code=${stateCode}`;
        const response = await makeRequest(endpoint, 'GET');

        if (response.status && Array.isArray(response.data)) {
            return response.data;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
}