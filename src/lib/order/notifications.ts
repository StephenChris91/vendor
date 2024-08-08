// lib/notifications.ts
import { order, shopOrder, shop, user, orderItem, shippingAddress } from '@prisma/client';
import { Resend } from 'resend';
import { db } from '../../../prisma/prisma';
import VendorNotificationEmail from '@lib/emails/vendorNotifications';
import OrderConfirmation from '@lib/emails/orderConfirmation';


const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

type OrderWithDetails = order & {
    orderItems: orderItem[];
    shippingAddress: shippingAddress;
};


interface VendorNotification {
    vendor: user;
    shop: shop;
    shopOrder: shopOrder & { orderItems: orderItem[] };
}

export async function notifyVendors(order: order & { shopOrders: shopOrder[] }): Promise<void> {
    const notifications: VendorNotification[] = await Promise.all(
        order.shopOrders.map(async (shopOrder) => {
            const shop = await db.shop.findUnique({
                where: { id: shopOrder.shopId },
                include: { user: true }
            });

            if (!shop || !shop.user) {
                throw new Error(`Shop or vendor not found for shopOrder ${shopOrder.id}`);
            }

            const fullShopOrder = await db.shopOrder.findUnique({
                where: { id: shopOrder.id },
                include: { orderItems: true }
            });

            if (!fullShopOrder) {
                throw new Error(`ShopOrder not found: ${shopOrder.id}`);
            }

            return {
                vendor: shop.user,
                shop,
                shopOrder: fullShopOrder
            };
        })
    );

    await Promise.all(notifications.map(sendVendorNotification));
}

async function sendVendorNotification({ vendor, shop, shopOrder }: VendorNotification): Promise<void> {
    try {
        await resend.emails.send({
            from: 'Vendorspot Team <admin@vendorspot.ng>',
            to: vendor.email,
            subject: `New Order Received - Order #${shopOrder.id}`,
            react: VendorNotificationEmail({
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
            })
        });
    } catch (error) {
        console.error(`Error sending vendor notification email to ${vendor.email}:`, error);
        throw new Error(`Failed to send vendor notification email to ${vendor.email}`);
    }
}

export async function sendOrderConfirmationEmail(userEmail: string, order: OrderWithDetails): Promise<void> {
    try {
        await resend.emails.send({
            from: 'Your E-commerce Platform <noreply@yourdomain.com>',
            to: userEmail,
            subject: `Order Confirmation - Order #${order.id}`,
            react: OrderConfirmation({ order })
        });
    } catch (error) {
        console.error(`Failed to send order confirmation email to ${userEmail}:`, error);
        // You might want to implement a retry mechanism or alert system here
    }
}