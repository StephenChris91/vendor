// app/api/products/vendor/route.ts

export const dynamic = 'force-dynamic'; // Add this line to mark the route as dynamic

import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';
import { auth } from 'auth';

// Import or define OrderStatus
type OrderStatus = "Pending" | "Processing" | "Complete";

function mapStatusToEnum(status: string): OrderStatus {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Pending';
        case 'processing':
            return 'Processing';
        case 'complete':
            return 'Complete';
        default:
            return 'Pending';
    }
}

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || session.user.role !== 'Vendor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        const skip = (page - 1) * pageSize;

        const orders = await db.order.findMany({
            where: {
                shopOrders: {
                    some: {
                        shop: {
                            userId: session.user.id
                        }
                    }
                }
            },
            include: {
                orderItems: true,
                shippingAddress: true,
                shopOrders: {
                    where: {
                        shop: {
                            userId: session.user.id
                        }
                    },
                    include: {
                        orderItems: true
                    }
                }
            },
            skip,
            take: pageSize,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalOrders = await db.order.count({
            where: {
                shopOrders: {
                    some: {
                        shop: {
                            userId: session.user.id
                        }
                    }
                }
            }
        });

        const formattedOrders = orders.map(order => ({
            id: order.id,
            userId: order.userId,
            status: mapStatusToEnum(order.status),
            subtotal: order.subtotal,
            tax: order.tax,
            shippingCost: order.shippingCost,
            totalPrice: order.totalPrice,
            paymentIntentId: order.paymentIntentId,
            paymentMethod: order.paymentMethod,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString(),
            shopId: order.shopId,
            paymentReference: order.paymentReference,
            orderItems: order.shopOrders.flatMap(so => so.orderItems.map(item => ({
                id: item.id,
                orderId: item.orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                name: item.name,
                sku: item.sku
            }))),
            shippingAddress: order.shippingAddress ? {
                id: order.shippingAddress.id,
                name: order.shippingAddress.name,
                street: order.shippingAddress.street,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                zipCode: order.shippingAddress.zipCode,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone
            } : null
        }));

        return NextResponse.json({
            orders: formattedOrders,
            meta: {
                page,
                pageSize,
                total: totalOrders,
                totalPages: Math.ceil(totalOrders / pageSize)
            }
        });
    } catch (error) {
        console.error('Error in vendor orders API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}