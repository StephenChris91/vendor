// app/api/upload/shop-banner/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3, folderExists, createFolder } from 'actions/s3Client';
import { auth } from 'auth';

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const userName = session.user.name;
        const folderPath = `${userName}/Banner`;

        if (!(await folderExists(folderPath))) {
            await createFolder(folderPath);
        }

        const fileName = `shop_banner_${Date.now()}_${file.name}`;
        const filePath = `${folderPath}/${fileName}`;
        const url = await uploadToS3(buffer, filePath);

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error uploading shop banner:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}