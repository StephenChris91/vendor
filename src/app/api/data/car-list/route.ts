import { NextResponse } from 'next/server';
import { db } from '../../../../../prisma/prisma';

export async function GET() {
    try {
        const cars = await db.product.findMany({
            where: {
                categories: {
                    some: {
                        category: {
                            name: 'Car'
                        }
                    }
                }
            },
            include: {
                categories: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // If you want to flatten the response to remove the junction table
        const simplifiedCars = cars.map(car => ({
            ...car,
            categories: car.categories.map(pc => pc.category)
        }));

        return NextResponse.json(simplifiedCars);
    } catch (error) {
        console.error('Error fetching car list:', error);
        return NextResponse.json({ error: 'Failed to fetch car list' }, { status: 500 });
    }
}