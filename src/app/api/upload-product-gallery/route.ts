import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { s3Client } from 'lib/utils';
import { auth } from 'auth';


export async function POST(request: NextRequest) {

  const session = await auth()
  try {
    const { base64, fileName } = await request.json();

    const buffer = Buffer.from(base64, 'base64');
    const fileBuffer = await sharp(buffer)
      .jpeg({ quality: 50 })
      .resize(800, 400)
      .toBuffer();

    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: `${session?.user.firstname}/shop/products/gallery/${fileName}`,
      Body: fileBuffer,
      ContentType: 'video/*',
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const url = `https://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${params.Key}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
