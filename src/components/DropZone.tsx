import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import Box from "@component/Box";
import Divider from "@component/Divider";
import { Button } from "@component/buttons";
import Typography, { H5, Small } from "@component/Typography";
import { uploadFile } from "actions/upload-logo";

export interface DropZoneProps {
  uploadType: string;
  maxSize?: number;
  acceptedFileTypes?: Record<string, string[]>;
  multiple?: boolean;
  onAuthError?: () => void;
  useS3?: boolean;
  onUpload?: (url: string, file: File) => void; // Updated this line
}

export default function DropZone({
  maxSize = 5 * 1024 * 1024,
  acceptedFileTypes = { "image/*": [".png", ".jpg", ".jpeg", ".gif"] },
  multiple = false,
  onAuthError,
  useS3 = true,
  onUpload,
}: DropZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      console.log("Files dropped:", acceptedFiles);
      setFiles(acceptedFiles);
      if (!useS3 && onUpload && acceptedFiles.length > 0) {
        // If not using S3, immediately call onUpload with the file and its object URL
        onUpload(URL.createObjectURL(acceptedFiles[0]), acceptedFiles[0]);
      }
    },
    [useS3, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedFileTypes,
    multiple,
  });

  const handleUpload = async () => {
    if (files.length > 0 && useS3) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", files[0]);

        const result = await uploadFile(formData);
        console.log("Upload result:", result); // Log this for debugging

        if (result.url) {
          toast.success("File uploaded successfully!");
          if (onUpload) {
            onUpload(result.url, files[0]); // Call onUpload with the returned URL and the file
          }
          setFiles([]);
        } else {
          throw new Error("No URL returned from server");
        }
      } catch (error) {
        console.error("Error in upload:", error); // Log the error details
        if (error instanceof Error) {
          if (error.message === "Unauthorized") {
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

        {useS3 && (
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
        )}

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
