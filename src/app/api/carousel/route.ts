// pages/api/carousel-items.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '../../../../prisma/prisma';

// Validation schema
const carouselItemSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    imgUrl: z.string().optional(),
    buttonLink: z.string().optional(),
    buttonText: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("Received data:", body); // Add this line for debugging
        const validatedData = carouselItemSchema.parse(body);

        // Ensure imgUrl is not an empty string
        if (validatedData.imgUrl === "") {
            validatedData.imgUrl = null;
        }

        const newCarouselItem = await db.mainCarousel.create({
            data: validatedData,
        });

        console.log("Created carousel item:", newCarouselItem); // Add this line for debugging
        return NextResponse.json(newCarouselItem, { status: 201 });
    } catch (error) {
        console.error('Error creating carousel item:', error);
        return NextResponse.json({ error: 'Failed to create carousel item' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const carouselItems = await db.mainCarousel.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5 // Limit to the 5 most recent items
        });
        return NextResponse.json(carouselItems);
    } catch (error) {
        console.error('Error fetching carousel items:', error);
        return NextResponse.json({ error: 'Failed to fetch carousel items' }, { status: 500 });
    }
}