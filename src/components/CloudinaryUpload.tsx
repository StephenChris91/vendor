"use client";

import { useState } from "react";
import { CldUploadButton, CldImage } from "next-cloudinary";
import { CloudUpload } from "lucide-react";
import styled from "styled-components";

// Styled components
const UploaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const UploadButton = styled(CldUploadButton)`
  display: inline-flex;
  align-items: center;
  border-radius: 0.3rem;
  border: none;
  background: none;
  background-color: ${(props) => props.theme.colors.primary[600]};
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  text-align: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary[800]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.colors.primary[300]};
  }
`;

const ErrorMessage = styled.p`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.error[600]};
`;

const MediaInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const MediaUrlText = styled.p`
  text-align: center;
`;

const MediaUrlLink = styled.a`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.blue[800]};

  &:hover {
    text-decoration: underline;
  }
`;

interface CloudinaryUploadResult {
  info: {
    resource_type: "image" | "video";
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  };
}

interface CloudinaryError {
  statusText: string;
}

interface UploaderProps {
  onUploadComplete: (uploadedUrls: string[]) => void; // Pass the uploaded URL(s)
  uploadPreset: string; // Preset to allow flexibility for different purposes (e.g., logos, products, gallery)
  multiple?: boolean; // Enable multiple file uploads
  buttonText?: string; // Custom button text (e.g., "Upload Logo" or "Upload Product Images")
}

export default function Uploader({
  onUploadComplete,
  uploadPreset,
  multiple = false,
  buttonText = "Upload",
}: UploaderProps) {
  const [info, setInfo] = useState<CloudinaryUploadResult["info"][]>([]); // Store array for multiple uploads
  const [error, setError] = useState<CloudinaryError | null>(null);

  function handleSuccess(result, widget) {
    const newInfo = result?.info;
    if (newInfo?.secure_url) {
      setInfo((prevInfo) => [...prevInfo, newInfo]);
      setError(null);

      // Pass array of secure URLs to the parent component
      const uploadedUrls = [
        ...info.map((item) => item.secure_url),
        newInfo.secure_url,
      ];
      onUploadComplete(uploadedUrls);
    }
    widget.close({
      quiet: true,
    });
  }

  function handleError(error, _widget) {
    setInfo([]);
    setError(error);
  }

  return (
    <UploaderContainer>
      <UploadButton
        uploadPreset={uploadPreset}
        onError={handleError}
        onSuccess={handleSuccess}
        options={{ multiple }}
      >
        <CloudUpload style={{ marginRight: "0.5rem" }} />
        {buttonText}
      </UploadButton>

      {error && <ErrorMessage>{error.statusText}</ErrorMessage>}
    </UploaderContainer>
  );
}
