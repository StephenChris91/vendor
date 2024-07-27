"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@lib/utils";
import sharp from "sharp";



export async function uploadFileToS3(base64: string, fileName: string, userName: string) {
  const buffer = Buffer.from(base64, "base64");
  const fileBuffer = await sharp(buffer)
    .jpeg({ quality: 50 })
    .resize(800, 400)
    .toBuffer();

  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: `${userName}/${fileName}`, // User-specific folder
    Body: fileBuffer,
    ContentType: "image/*",
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    console.log("File uploaded successfully");

    // Construct the URL of the uploaded file
    const url = `https://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${params.Key}`;

    return url;
  } catch (error) {
    throw error;
  }
}
