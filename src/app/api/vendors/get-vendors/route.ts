// app/api/get-vendors/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function POST(request: NextRequest) {
    try {
        const { cartItems } = await request.json();

        if (!cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'No cart items provided' }, { status: 400 });
        }

        const productIds = cartItems.map(item => item.productId);

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

        return NextResponse.json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        return NextResponse.json({ error: 'Failed to fetch vendors' }, { status: 500 });
    }
}