// actions/notifications.ts

import { order, shopOrder, shop, user, orderItem, shippingAddress, } from '@prisma/client';
import { db } from '../../prisma/prisma';

// Type definitions
type OrderWithDetails = order & {
    orderItems: orderItem[];
    shippingAddress: shippingAddress;
};

interface VendorNotification {
    vendor: Pick<user, 'id' | 'email' | 'firstname'>;
    shop: Pick<shop, 'id' | 'shopName'>;
    shopOrder: shopOrder & { orderItems: orderItem[] };
}

// Helper functions
function calculateSubtotal(items: any[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function calculateTax(subtotal: number, state: string, shopId: string): Promise<number> {
    // Implement your tax calculation logic here
    return subtotal * 0.05; // 5% tax as an example
}

async function calculateShipping(items: any[], shippingAddress: any): Promise<number> {
    // Implement your shipping calculation logic here
    return 1000; // Flat rate of 1000 as an example
}

export async function sendNotifications(
    orderId: string,
    customerEmail: string,
    validShops: any,
    cartItems: any[],
    totalAmount: number,
    paystackTransaction: any,
    itemsByShop: { [key: string]: any[] }
) {
    try {
        const shippingAddress = cartItems[0]?.shippingAddress || {};
        const state = shippingAddress.state || '';

        if (!state) {
            console.warn('Shipping address state is missing for tax calculation in notifications');
        }

        // Send order confirmation email to the customer
        await sendOrderConfirmationEmail(customerEmail, {
            id: orderId,
            orderItems: cartItems,
            subtotal: calculateSubtotal(cartItems),
            tax: await calculateTax(calculateSubtotal(cartItems), state, Object.keys(validShops)[0]),
            shippingCost: await calculateShipping(cartItems, shippingAddress),
            totalPrice: totalAmount,
            shippingAddress,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'Pending Payment',
            userId: '',
            paymentMethod: 'Paystack',
            paymentReference: paystackTransaction.reference,
        } as OrderWithDetails);

        console.log('Order confirmation email sent successfully to customer');

        // Send notifications to each vendor
        for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
            const shop = validShops[shopId];
            if (!shop) {
                console.error(`Shop not found for shopId: ${shopId}`);
                continue;
            }

            const vendor = await db.user.findUnique({
                where: { id: shop.userId, role: 'Vendor' },
                select: { id: true, email: true, firstname: true }
            });

            if (!vendor) {
                console.error(`Vendor not found for shop: ${shopId}`);
                continue;
            }

            const shopDetails = await db.shop.findUnique({
                where: { id: shopId },
                select: { id: true, shopName: true }
            });

            if (!shopDetails) {
                console.error(`Shop details not found for shop: ${shopId}`);
                continue;
            }

            const shopSubtotal = calculateSubtotal(shopItems);
            const shopTax = await calculateTax(shopSubtotal, state, shopId);
            const shopShippingCost = await calculateShipping(shopItems, shippingAddress);

            try {
                await sendVendorNotification({
                    vendor,
                    shop: shopDetails,
                    shopOrder: {
                        id: orderId,
                        orderItems: shopItems,
                        subtotal: shopSubtotal,
                        tax: shopTax,
                        shippingCost: shopShippingCost,
                        totalPrice: shopSubtotal + shopTax + shopShippingCost,
                        createdAt: new Date(),
                        status: 'Pending Payment',
                        shopId: shopId,
                        orderId: orderId,
                    } as shopOrder & { orderItems: orderItem[] }
                });
                console.log(`Vendor notification sent successfully for shop: ${shopId}`);
            } catch (error) {
                console.error(`Failed to send vendor notification for shop ${shopId}:`, error);
            }
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}

async function sendVendorNotification({ vendor, shop, shopOrder }: VendorNotification): Promise<void> {
    try {
        console.log(`Sending vendor notification to ${vendor.email} for shop ${shop.shopName}`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_DEV_URL}/api/send-mail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'vendor-notification',
                data: {
                    vendorName: vendor.firstname,
                    shopName: shop.shopName,
                    orderId: shopOrder.id,
                    orderDate: shopOrder.createdAt.toLocaleString(),
                    orderItems: shopOrder.orderItems.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    subtotal: shopOrder.subtotal,
                    tax: shopOrder.tax,
                    shippingCost: shopOrder.shippingCost,
                    total: shopOrder.totalPrice
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            console.log(`Vendor notification email sent to ${vendor.email}`);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error(`Error sending vendor notification email to ${vendor.email}:`, error);
        throw new Error(`Failed to send vendor notification email to ${vendor.email}`);
    }
}

async function sendOrderConfirmationEmail(userEmail: string, order: OrderWithDetails): Promise<void> {
    try {
        console.log(`Sending order confirmation email to ${userEmail}`);
        const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_DEV_URL}/api/send-mail`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'order-confirmation',
                data: { userEmail, order }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
            console.log(`Order confirmation email sent to ${userEmail}`);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error(`Failed to send order confirmation email to ${userEmail}:`, error);
        // You might want to implement a retry mechanism or alert system here
    }
}