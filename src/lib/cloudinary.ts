import { v2 as cloudinary } from "cloudinary";

const cloud = cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

console.log("API Key:", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
console.log("Upload Preset:", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
export default cloud
