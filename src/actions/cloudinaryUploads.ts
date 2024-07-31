// actions/cloudinaryUploads.ts
"use server";

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(file: string, folder: string, resourceType: "image" | "video" = "image") {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: resourceType,
        }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
}

export async function uploadProductImageToCloudinary(base64: string, userName: string) {
    const result: any = await uploadToCloudinary(base64, `${userName}/products`);
    return result.secure_url;
}

export async function uploadProductGalleryToCloudinary(base64: string, userName: string) {
    const result: any = await uploadToCloudinary(base64, `${userName}/products/gallery`);
    return result.secure_url;
}

export async function uploadProductVideoToCloudinary(base64: string, userName: string) {
    const result: any = await uploadToCloudinary(base64, `${userName}/products/videos`, "video");
    return result.secure_url;
}

export async function uploadShopLogoToCloudinary(base64: string, userName: string) {
    const result: any = await uploadToCloudinary(base64, `${userName}/shop/logo`);
    return result.secure_url;
}

export async function uploadShopBannerToCloudinary(base64: string, userName: string) {
    const result: any = await uploadToCloudinary(base64, `${userName}/shop/banner`);
    return result.secure_url;
}

export async function uploadUserAvatarToCloudinary(base64: string, userName: string) {
    const result: any = await uploadToCloudinary(base64, `${userName}/avatar`);
    return result.secure_url;
}