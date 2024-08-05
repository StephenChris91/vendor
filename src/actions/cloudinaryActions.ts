// app/actions/cloudinaryActions.ts
"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
    secure: true,
});

export async function getSignature() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp: timestamp,
            folder: "products", // Adjust this folder name as needed
            upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        },
        process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET as string
    );

    return {
        timestamp,
        signature,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY as string,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string,
    };
}

export async function createUpload(formData: FormData) {
    const file = formData.get("file") as File;
    if (!file) {
        throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: "products", // Adjust this folder name as needed
                upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            },
            (error, result) => {
                if (error) {
                    console.error("Upload error:", error);
                    reject(new Error("Upload failed"));
                } else if (result) {
                    resolve(result.secure_url);
                }
            }
        ).end(buffer);
    });
}