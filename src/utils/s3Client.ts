// utils/s3Client.ts

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import path from 'path';

const s3Client = new S3Client({
    region: process.env.AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
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
    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
    });

    await s3Client.send(command);
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${key}`;
}

export async function folderExists(folderName: string) {
    try {
        const command = new HeadObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
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
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folderName}/`,
        Body: '',
    });
    await s3Client.send(command);
}