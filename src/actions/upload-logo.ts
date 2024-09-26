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
    console.log("Session data:", session); // Check session in production

    if (!session || !session.user) {
        console.log('User is not authorized');
        throw new Error('Unauthorized');
    }

    const file = formData.get('file') as File;
    if (!file) {
        console.log('No file uploaded');
        throw new Error('No file uploaded');
    }

    console.log("File received:", file.name, file.size); // Check file details

    const buffer = Buffer.from(await file.arrayBuffer());
    const userName = session.user.firstname;
    const folderPath = `${userName}/Logo`;

    console.log("Folder path:", folderPath); // Track folder creation

    if (!(await folderExists(folderPath))) {
        console.log("Folder does not exist, creating...");
        await createFolder(folderPath);
    }

    const fileName = `${Date.now()}_${file.name}`;
    const filePath = `${folderPath}/${fileName}`;
    console.log("File path:", filePath); // Track the file path

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
        console.log("Upload result:", result); // Log the upload result
        const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${filePath}`;
        return { url };
    } catch (error) {
        console.error('Error uploading to S3:', error); // Log error
        throw new Error('Failed to upload file to S3');
    }
}
