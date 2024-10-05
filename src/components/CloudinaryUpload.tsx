"use client";

import { useState } from "react";
import { CldUploadButton, CldImage, CldVideoPlayer } from "next-cloudinary";
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
  } | null;
}

interface CloudinaryError {
  statusText: string;
}

interface UploaderProps {
  onLogoUpload: (logoUrl: string) => void; // New prop to pass URL back to parent
}

export default function Uploader({ onLogoUpload }: UploaderProps) {
  const [info, setInfo] = useState<CloudinaryUploadResult["info"]>(null);
  const [error, setError] = useState<CloudinaryError | null>(null);

  function handleSuccess(result, widget) {
    setInfo(result?.info);
    setError(null);
    if (result?.info?.secure_url) {
      onLogoUpload(result.info.secure_url); // Pass URL to parent component
    }
    widget.close({
      quiet: true,
    });
  }

  function handleError(error, _widget) {
    setInfo(null);
    setError(error);
  }

  return (
    <UploaderContainer>
      <UploadButton
        uploadPreset="vendorspot"
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <CloudUpload style={{ marginRight: "0.5rem" }} />
        Upload
      </UploadButton>

      {error && <ErrorMessage>{error.statusText}</ErrorMessage>}
    </UploaderContainer>
  );
}
