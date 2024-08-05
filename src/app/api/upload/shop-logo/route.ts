// app/api/upload/product-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'auth';
import { createFolder, folderExists, uploadToS3 } from '@utils/s3Client';

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session) console.log(session);

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const userName = session.user?.firstname;
        const folderPath = `${userName}/Logo`;

        if (!(await folderExists(folderPath))) {
            await createFolder(folderPath);
        }

        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${folderPath}/${fileName}`;
        const url = await uploadToS3(buffer, filePath);

        // Ensure we're returning a JSON object with the url property
        return NextResponse.json({ url: url });
    } catch (error) {
        console.error('Error uploading product image:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}