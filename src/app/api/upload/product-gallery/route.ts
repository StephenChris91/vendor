// app/api/upload/product-gallery/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createFolder, folderExists, uploadToS3 } from 'actions/s3Client';
import { auth } from 'auth';

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        if (files.length === 0) {
            return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
        }

        const userName = session.user.name;
        const folderPath = `${userName}/Product Gallery`;

        if (!(await folderExists(folderPath))) {
            await createFolder(folderPath);
        }

        const uploadPromises = files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${Date.now()}_${file.name}`;
            const filePath = `${folderPath}/${fileName}`;
            return uploadToS3(buffer, filePath);
        });

        const urls = await Promise.all(uploadPromises);

        return NextResponse.json({ urls });
    } catch (error) {
        console.error('Error uploading product gallery:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}