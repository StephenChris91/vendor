// components/CloudinaryUploadWidget.tsx
"use client";

import { useEffect, useRef } from "react";

interface CloudinaryUploadWidgetProps {
  onUpload: (error: any, result: any, widget: any) => void;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onUpload,
}) => {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          resourceType: "auto", // allows both images and videos
        },
        onUpload
      );
    }
  }, [onUpload]);

  return <button onClick={() => widgetRef.current.open()}>Upload File</button>;
};

export default CloudinaryUploadWidget;
