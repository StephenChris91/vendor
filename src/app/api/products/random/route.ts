import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const products = await db.product.findMany({
            take: 8,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                shop: {
                    select: {
                        id: true,
                        shopName: true
                    }
                }
            }
        });

        // Shuffle the products array
        for (let i = products.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [products[i], products[j]] = [products[j], products[i]];
        }

        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching random products:', error);
        return NextResponse.json({ message: 'Error fetching random products' }, { status: 500 });
    }
}