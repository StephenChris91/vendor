import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';
import { validateInventory } from '@lib/order/inventory';
import { calculateTax } from '@lib/order/calculateTax';
import { calculateShipping } from '@lib/order/calculateShipping';
import { getUserByEmail } from '@lib/data/user';
import { useCurrentSession, useCurrentUser } from '@lib/use-session-server';
import { initializePaystackTransaction } from '@lib/order/createPayment';
import { sendOrderConfirmationEmail, sendVendorNotificationEmail } from '@lib/emails/mail';

export async function POST(req: Request) {
    try {
        // Validate the session and user
        const session = await useCurrentSession();
        const user = await useCurrentUser();

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse the request body
        const { cartItems, shippingAddress } = await req.json();

        // Ensure shippingAddress.state exists and is not empty
        if (!shippingAddress || !shippingAddress.state) {
            return NextResponse.json({ error: 'Shipping address state is required for tax calculation' }, { status: 400 });
        }

        // Validate inventory
        const inventoryCheck = await validateInventory(cartItems);
        if (!inventoryCheck.success) {
            return NextResponse.json({ error: inventoryCheck.error }, { status: 400 });
        }

        // Group cart items by shop and validate shops
        const { itemsByShop, validShops } = await groupAndValidateCartItemsByShop(cartItems);

        if (Object.keys(validShops).length === 0) {
            return NextResponse.json({ error: 'No valid shops found for the items in the cart' }, { status: 400 });
        }

        const existingUser = await getUserByEmail(session.user.email);
        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate totals
        const subtotal = calculateSubtotal(cartItems);
        const primaryShopId = Object.keys(validShops)[0];
        const taxAmount = await calculateTax(subtotal, shippingAddress.state, primaryShopId);
        const shippingCost = await calculateShipping(cartItems, shippingAddress);
        const totalAmount = subtotal + taxAmount + shippingCost;

        // Initialize Paystack transaction
        const paystackTransaction = await initializePaystackTransaction(totalAmount, session.user.email);

        // Wrap the order creation and notifications in a transaction
        const transaction = await db.$transaction(async (prisma) => {
            // Choose the first valid shop as the primary shop for the main order
            const primaryShopId = Object.keys(validShops)[0];
            const primaryShop = validShops[primaryShopId];

            // Create main order
            const mainOrder = await prisma.order.create({
                data: {
                    user: { connect: { id: existingUser.id } },
                    shop: { connect: { id: primaryShop.id } },
                    status: 'Pending Payment',
                    subtotal,
                    tax: taxAmount,
                    shippingCost,
                    totalPrice: totalAmount,
                    paymentReference: paystackTransaction.reference,
                    paymentMethod: 'Paystack',
                    shippingAddress: {
                        create: {
                            name: shippingAddress.name,
                            street: shippingAddress.street,
                            city: shippingAddress.city,
                            state: shippingAddress.state,
                            zipCode: shippingAddress.zipCode,
                            country: shippingAddress.country,
                            phone: shippingAddress.phone
                        }
                    }
                }
            });

            // Create shop orders and order items for each shop
            for (const [shopId, items] of Object.entries(itemsByShop)) {
                await createShopOrder(prisma, mainOrder.id, shopId, items, shippingAddress);
            }

            return mainOrder;
        });

        // Send notifications outside of the transaction to avoid potential delays in database operations
        await sendNotifications(transaction.id, session.user.email, validShops, cartItems, totalAmount, paystackTransaction, itemsByShop);

        // Return the complete order and payment details
        const completeOrder = await db.order.findUnique({
            where: { id: transaction.id },
            include: {
                shopOrders: {
                    include: {
                        orderItems: true
                    }
                },
                shippingAddress: true
            }
        });

        return NextResponse.json({
            order: completeOrder,
            paymentDetails: {
                authorizationUrl: paystackTransaction.authorizationUrl,
                reference: paystackTransaction.reference
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}

// Utility function to calculate the subtotal
function calculateSubtotal(cartItems: any[]): number {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Function to group and validate cart items by shop
async function groupAndValidateCartItemsByShop(cartItems: any[]) {
    const itemsByShop: { [key: string]: any[] } = {};
    const validShops: { [key: string]: { id: string, slug: string, userId: string } } = {};

    for (const item of cartItems) {
        const product = await db.product.findUnique({
            where: { id: item.id },
            select: { shop: { select: { id: true, slug: true, userId: true } } }
        });

        if (product && product.shop) {
            const shopId = product.shop.id;
            if (!itemsByShop[shopId]) {
                itemsByShop[shopId] = [];
            }
            itemsByShop[shopId].push(item);

            // Validate and store shop information
            if (!validShops[shopId]) {
                const shop = await db.shop.findUnique({
                    where: { id: shopId },
                    select: { id: true, slug: true, userId: true }
                });
                if (shop) {
                    validShops[shopId] = shop;
                }
            }
        }
    }

    return { itemsByShop, validShops };
}

// Function to create a shop order and its associated order items
async function createShopOrder(prisma: any, orderId: string, shopId: string, items: any[], shippingAddress: any) {
    const shopSubtotal = calculateSubtotal(items);
    const shopTax = await calculateTax(shopSubtotal, shippingAddress.state, shopId);
    const shopShippingCost = await calculateShipping(items, shippingAddress);

    return prisma.shopOrder.create({
        data: {
            order: { connect: { id: orderId } },
            shop: { connect: { id: shopId } },
            status: 'Pending Payment',
            subtotal: shopSubtotal,
            tax: shopTax,
            shippingCost: shopShippingCost,
            totalPrice: shopSubtotal + shopTax + shopShippingCost,
            orderItems: {
                create: items.map(item => ({
                    order: { connect: { id: orderId } },
                    product: { connect: { id: item.id } },
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    sku: item.sku || '' // Ensure sku is a string
                }))
            }
        }
    });
}

// Function to send notifications (emails) to the customer and vendors
async function sendNotifications(orderId: string, customerEmail: string, validShops: any, cartItems: any[], totalAmount: number, paystackTransaction: any, itemsByShop: { [key: string]: any[] }) {
    try {
        const shippingAddress = cartItems[0]?.shippingAddress || {};
        const state = shippingAddress.state || '';

        if (!state) {
            console.warn('Shipping address state is missing for tax calculation in notifications');
        }

        // Send order confirmation email to the customer
        await sendOrderConfirmationEmail(customerEmail, {
            orderId: paystackTransaction.reference,
            items: cartItems,
            subtotal: calculateSubtotal(cartItems),
            tax: await calculateTax(calculateSubtotal(cartItems), state, Object.keys(validShops)[0]),
            shippingCost: await calculateShipping(cartItems, shippingAddress),
            totalAmount,
            shippingAddress
        });

        // Send notifications to each vendor
        for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
            const shop = validShops[shopId];
            if (!shop) continue;

            const vendor = await db.user.findUnique({
                where: { id: shop.userId, role: 'Vendor' },
                select: { id: true, email: true }
            });

            if (!vendor) {
                console.error(`Vendor not found for shop: ${shopId}`);
                continue;
            }

            const shopDetails = await db.shop.findUnique({
                where: { id: shopId },
                select: { shopName: true }
            });

            if (!shopDetails) {
                console.error(`Shop details not found for shop: ${shopId}`);
                continue;
            }

            const shopSubtotal = calculateSubtotal(shopItems);
            const shopTax = await calculateTax(shopSubtotal, state, shopId);
            const shopShippingCost = await calculateShipping(shopItems, shippingAddress);

            await sendVendorNotificationEmail({
                ...vendor,
                shopName: shopDetails.shopName
            }, {
                items: shopItems,
                subtotal: shopSubtotal,
                tax: shopTax,
                shippingCost: shopShippingCost,
                totalPrice: shopSubtotal + shopTax + shopShippingCost,
                shippingAddress
            }, paystackTransaction.reference);
        }
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}