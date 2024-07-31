// app/api/upload/shop-banner/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadShopBannerToCloudinary } from 'actions/cloudinaryUploads';
import { auth } from 'auth';

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { base64 } = await request.json();
        const url = await uploadShopBannerToCloudinary(base64, session.user.firstname);
        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error uploading shop banner:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

