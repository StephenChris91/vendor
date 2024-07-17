import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { auth } from 'auth'; // Adjust the path as necessary
import { useCurrentSession } from 'lib/use-session-server';
import { s3Client } from 'lib/utils';


export async function POST(req: NextRequest) {
  try {
    const session = await useCurrentSession() // Ensure the auth function works with NextRequest

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ message: "Missing fileName or fileType" }, { status: 400 });
    }

    const key = `${session.user.firstname}/shop/products/${uuidv4()}-${fileName}`;
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

    const params = {
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return NextResponse.json({
      presignedUrl,
      url: `https://${bucketName}.s3.amazonaws.com/${key}`,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({ message: "Error generating presigned URL" }, { status: 500 });
  }
}