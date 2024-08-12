// app/api/orders/route.ts

import { NextResponse } from 'next/server';
import { db } from '../../../../prisma/prisma';
import { validateInventory } from '@lib/order/inventory';
import { calculateTax } from '@lib/order/calculateTax';
import { calculateShipping } from '@lib/order/calculateShipping';
import { getUserByEmail } from '@lib/data/user';
import { useCurrentSession, useCurrentUser } from '@lib/use-session-server';
import { initializePaystackTransaction, verifyPaystackTransaction } from '@lib/order/createPayment';

export async function POST(req: Request) {
    try {
        const session = await useCurrentSession();
        const user = await useCurrentUser();

        if (!session || !session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cartItems, shippingAddress } = await req.json();

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

        const existingUser = await getUserByEmail(session.user?.email);
        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate totals
        const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        let taxAmount;
        try {
            taxAmount = await calculateTax(subtotal, shippingAddress.state);
        } catch (error) {
            console.error('Error calculating tax:', error);
            taxAmount = 0; // Set a default value or handle this case as appropriate
        }
        const shippingCost = await calculateShipping(cartItems, shippingAddress);
        const totalAmount = subtotal + taxAmount + shippingCost;

        // Initialize Paystack transaction
        const paystackTransaction = await initializePaystackTransaction(totalAmount, session.user.email);

        // Choose the first valid shop as the primary shop for the main order
        const primaryShopId = Object.keys(validShops)[0];
        const primaryShop = validShops[primaryShopId];

        // Create main order
        const mainOrder = await db.order.create({
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

        // Create shopOrders and orderItems for each shop
        for (const [shopId, items] of Object.entries(itemsByShop)) {
            const shop = validShops[shopId];
            if (!shop) continue; // Skip if shop is not valid

            const shopSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shopTax = await calculateTax(shopSubtotal, shippingAddress.state);
            const shopShippingCost = await calculateShipping(items, shippingAddress);

            await db.shopOrder.create({
                data: {
                    order: { connect: { id: mainOrder.id } },
                    shop: { connect: { id: shop.id } },
                    status: 'Pending Payment',
                    subtotal: shopSubtotal,
                    tax: shopTax,
                    shippingCost: shopShippingCost,
                    totalPrice: shopSubtotal + shopTax + shopShippingCost,
                    orderItems: {
                        create: items.map(item => ({
                            order: { connect: { id: mainOrder.id } },
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

        // Fetch the complete order with all relations
        const completeOrder = await db.order.findUnique({
            where: { id: mainOrder.id },
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