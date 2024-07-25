import { uploadFileToS3 } from 'actions/upload-signUrl';
import { useState } from 'react';

export function useUploadImage(userName: string) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const uploadImage = async (file: File) => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const base64 = await fileToBase64(file);
            const url = await uploadFileToS3(base64, file.name, userName);
            setIsUploading(false);
            return url;
        } catch (error) {
            setUploadError('Failed to upload image');
            setIsUploading(false);
            throw error;
        }
    };

    const uploadMultipleImages = async (files: File[]) => {
        setIsUploading(true);
        setUploadError(null);
        try {
            const urls = await Promise.all(files.map(async (file) => {
                const base64 = await fileToBase64(file);
                return uploadFileToS3(base64, file.name, userName);
            }));
            setIsUploading(false);
            return urls;
        } catch (error) {
            setUploadError('Failed to upload one or more images');
            setIsUploading(false);
            throw error;
        }
    };

    return { uploadImage, uploadMultipleImages, isUploading, uploadError };
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            } else {
                reject(new Error('Failed to convert file to base64'));
            }
        };
        reader.onerror = error => reject(error);
    });
}