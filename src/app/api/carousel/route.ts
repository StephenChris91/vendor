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
        console.log("Received data:", body);
        const validatedData = carouselItemSchema.parse(body);

        if (validatedData.imgUrl === "") {
            validatedData.imgUrl = null;
        }

        const newCarouselItem = await db.mainCarousel.create({
            data: validatedData,
        });

        console.log("Created carousel item:", newCarouselItem);
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
            take: 5
        });
        return NextResponse.json(carouselItems);
    } catch (error) {
        console.error('Error fetching carousel items:', error);
        return NextResponse.json({ error: 'Failed to fetch carousel items' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, ...data } = await req.json();
        const validatedData = carouselItemSchema.parse(data);

        if (validatedData.imgUrl === "") {
            validatedData.imgUrl = null;
        }

        const updatedCarouselItem = await db.mainCarousel.update({
            where: { id },
            data: validatedData,
        });

        console.log("Updated carousel item:", updatedCarouselItem);
        return NextResponse.json(updatedCarouselItem);
    } catch (error) {
        console.error('Error updating carousel item:', error);
        return NextResponse.json({ error: 'Failed to update carousel item' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        await db.mainCarousel.delete({
            where: { id },
        });

        console.log("Deleted carousel item with id:", id);
        return NextResponse.json({ message: 'Carousel item deleted successfully' });
    } catch (error) {
        console.error('Error deleting carousel item:', error);
        return NextResponse.json({ error: 'Failed to delete carousel item' }, { status: 500 });
    }
}