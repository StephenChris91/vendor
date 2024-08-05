// app/actions/uploadFile.ts

'use server'

import { auth } from 'auth';
import { createFolder, folderExists } from '@utils/s3Client';
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

const s3Config: S3ClientConfig = {
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
};

const s3Client = new S3Client(s3Config);

export async function uploadFile(formData: FormData) {
    const session = await auth();
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    const file = formData.get('file') as File;
    if (!file) {
        throw new Error('No file uploaded');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const userName = session.user.firstname;
    const folderPath = `${userName}/Logo`;

    if (!(await folderExists(folderPath))) {
        await createFolder(folderPath);
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folderPath}/${fileName}`;

    const upload = new Upload({
        client: s3Client,
        params: {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
            Body: buffer,
            ContentType: file.type,
        },
    });

    try {
        const result = await upload.done();
        const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${filePath}`;
        return { url };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
}