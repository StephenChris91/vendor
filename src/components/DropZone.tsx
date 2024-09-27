import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import Box from "@component/Box";
import Divider from "@component/Divider";
import { Button } from "@component/buttons";
import Typography, { H5, Small } from "@component/Typography";

export interface DropZoneProps {
  uploadType?: string;
  maxSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
  multiple?: boolean;
  onAuthError?: () => void;
  onUpload?: (url: string, file: File) => void;
}

export default function DropZone({
  uploadType,
  maxSize = 5 * 1024 * 1024,
  acceptedFileTypes = { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
  multiple = false,
  onAuthError,
  onUpload,
}: DropZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes,
    multiple,
  });

  const handleUpload = async () => {
    if (files.length > 0) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", files[0]);

        const response = await fetch(`/api/upload/${uploadType}`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.url) {
          toast.success("File uploaded successfully!");
          if (onUpload) {
            onUpload(result.url, files[0]);
          }
          setFiles([]);
        } else {
          throw new Error("No URL returned from server");
        }
      } catch (error) {
        console.error("Error in upload:", error);
        if (error instanceof Error) {
          if (error.message.includes("401")) {
            toast.error("You are not authorized. Please log in and try again.");
            onAuthError && onAuthError();
          } else {
            toast.error(`Upload failed: ${error.message}`);
          }
        } else {
          toast.error("An unexpected error occurred during upload");
        }
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <Box {...getRootProps()}>
      <input {...getInputProps()} />
      <Box
        display="flex"
        minHeight="200px"
        alignItems="center"
        border="1px dashed"
        borderRadius="10px"
        flexDirection="column"
        borderColor="gray.400"
        justifyContent="center"
        transition="all 250ms ease-in-out"
        style={{ outline: "none", cursor: "pointer" }}
      >
        <H5 mb="18px" color="text.muted">
          {isDragActive
            ? "Drop the files here ..."
            : "Click or drag & drop to upload file"}
        </H5>

        <Divider width="200px" mx="auto" />
        <Typography
          px="1rem"
          mb="18px"
          mt="-10px"
          lineHeight="1"
          color="text.muted"
          bg="body.paper"
        >
          or
        </Typography>

        <Button
          color="primary"
          bg="primary.light"
          px="2rem"
          mb="22px"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleUpload();
          }}
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>

        <Small color="text.muted">
          Max file size: {maxSize / (1024 * 1024)}MB
        </Small>
      </Box>
      {files.length > 0 && (
        <div>
          <h4>Selected Files:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
}
