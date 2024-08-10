// cartUtils.ts

export async function getVendorsFromCart(cartItems: any[]) {
    console.log('Getting vendors from cart items:', cartItems);

    if (!cartItems || cartItems.length === 0) {
        console.error('No cart items provided to getVendorsFromCart');
        return [];
    }

    try {
        const response = await fetch('/api/vendors/get-vendors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItems }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch vendors');
        }

        const vendors = await response.json();
        console.log('Processed vendors:', vendors);

        return vendors;
    } catch (error) {
        console.error('Error fetching vendors from cart:', error);
        throw error;
    }
}