import { db } from "../../prisma/prisma";


export async function getVendorsFromCart(cartItems: any[]) {
    console.log('Getting vendors from cart items:', cartItems);

    if (!cartItems || cartItems.length === 0) {
        console.error('No cart items provided to getVendorsFromCart');
        return [];
    }

    const productIds = cartItems.map(item => item.id);
    console.log('Product IDs:', productIds);

    try {
        const vendorsWithProducts = await db.shop.findMany({
            where: {
                products: {
                    some: {
                        id: {
                            in: productIds
                        }
                    }
                }
            },
            include: {
                user: true,
                address: true,
                shopSettings: true,
                products: {
                    where: {
                        id: {
                            in: productIds
                        }
                    }
                }
            }
        });

        console.log('Vendors with products:', vendorsWithProducts);

        const vendors = vendorsWithProducts.map(shop => ({
            id: shop.id,
            name: shop.shopName,
            email: shop.user.email,
            phone: shop.shopSettings?.phoneNumber,
            address: {
                street: shop.address?.street,
                city: shop.address?.city,
                state: shop.address?.state,
                country: shop.address?.country
            },
            products: shop.products
        }));

        console.log('Processed vendors:', vendors);

        return vendors;
    } catch (error) {
        console.error('Error fetching vendors from cart:', error);
        throw error;
    }
}