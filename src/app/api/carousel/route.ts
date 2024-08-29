import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../../prisma/prisma';

// Validation schema
const carouselItemSchema = z.object({
    title: z.string().optional(),
    imgUrl: z.string().optional(),
    buttonLink: z.string().optional(),
    buttonText: z.string().optional(),
    description: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const validatedData = carouselItemSchema.parse(body);

        const newCarouselItem = await db.mainCarousel.create({
            data: validatedData,
        });

        return NextResponse.json(newCarouselItem, { status: 201 });
    } catch (error) {
        console.error('Error creating carousel item:', error);
        return NextResponse.json({ error: 'Failed to create carousel item' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const carouselItems = await db.mainCarousel.findMany();
        return NextResponse.json(carouselItems);
    } catch (error) {
        console.error('Error fetching carousel items:', error);
        return NextResponse.json({ error: 'Failed to fetch carousel items' }, { status: 500 });
    }
}