
// "use server"

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import path from 'path';

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEYS_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
});



function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.avi': 'video/x-msvideo',
        '.mov': 'video/quicktime',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

export async function uploadToS3(file: Buffer, key: string) {
    const contentType = getContentType(key);
    console.log('Uploading file:', key, 'with content type:', contentType);

    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: file,
        ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION!}.amazonaws.com/${key}`;
}


export async function folderExists(folderName: string) {
    try {
        const command = new HeadObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
            Key: `${folderName}/`,
        });
        await s3Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}

export async function createFolder(folderName: string) {
    const command = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: `${folderName}/`, // S3 folder creation
        Body: '', // Create an empty file to simulate folder
    });
    await s3Client.send(command);
}
