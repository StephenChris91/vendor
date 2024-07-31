import { useCallback, useEffect, useRef } from "react";
import Box from "./Box";
import Divider from "./Divider";
import { Button } from "./buttons";
import Typography, { H5, Small } from "./Typography";

export interface DropZoneProps {
  onChange?: (result: any) => void;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function DropZone({ onChange }: DropZoneProps) {
  const cloudinaryRef = useRef<any>();
  const widgetRef = useRef<any>();

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        maxFiles: 10,
        sources: ["local", "url", "camera"],
        multiple: true,
        resourceType: "auto",
      },
      function (error: any, result: any) {
        if (!error && result && result.event === "success") {
          if (onChange) onChange(result.info);
        }
      }
    );
  }, [onChange]);

  const openWidget = useCallback(() => {
    if (widgetRef.current) widgetRef.current.open();
  }, []);

  return (
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
      style={{ outline: "none" }}
      onClick={openWidget}
    >
      <H5 mb="18px" color="text.muted">
        Drag & drop product image here
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
      >
        Select files
      </Button>

      <Small color="text.muted">Upload 280*280 image</Small>
    </Box>
  );
}
