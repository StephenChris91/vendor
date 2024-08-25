'use server'

import { db } from "../../prisma/prisma";

export async function getCustomerProfile(userId: string) {
    try {
        console.log('Fetching customer profile for user:', userId);

        const user = await db.user.findUnique({
            where: {
                id: userId,
                role: 'Customer',
            },
            include: {
                orders: {
                    select: {
                        status: true,
                    },
                },
                cart: {
                    include: {
                        cartItems: true,
                    },
                },
            },
        });

        if (!user) {
            console.log('Customer not found');
            throw new Error('Customer not found');
        }

        const orderCounts = {
            total: user.orders.length,
            awaitingPayment: user.orders.filter(order => order.status === 'Pending').length,
            awaitingShipment: user.orders.filter(order => order.status === 'Processing').length,
            awaitingDelivery: user.orders.filter(order => order.status === 'Complete').length,
        };

        console.log('Fetched customer profile successfully:', userId);

        return {
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            role: user.role,
            orderCounts,
            cartItemsCount: user.cart?.cartItems.length || 0,
        };
    } catch (error) {
        console.error('Error fetching customer profile:', error);
        throw error;
    }
}
