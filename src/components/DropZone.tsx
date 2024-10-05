import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import Box from "./Box";
import Divider from "./Divider";
import { Button } from "./buttons";
import Typography, { H5, Small } from "./Typography";

// ==============================================================
// Accept only document files (PDF, Word, etc.), maximum 2 files
export interface DropZoneProps {
  onChange?: (files: File[]) => void;
}
// ==============================================================

export default function DropZone({ onChange }: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onChange) onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 2, // Allow only a maximum of 2 files
      multiple: true,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
    });

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
      bg={isDragActive && "gray.200"}
      transition="all 250ms ease-in-out"
      style={{ outline: "none" }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <H5 mb="18px" color="text.muted">
        Drag & drop your documents here
      </H5>

      <Divider width="200px" mx="auto" />
      <Typography
        px="1rem"
        mb="18px"
        mt="-10px"
        lineHeight="1"
        color="text.muted"
        bg={isDragActive ? "gray.200" : "body.paper"}
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

      <Small color="text.muted">
        Upload PDF, DOC, or DOCX files (Max: 2 documents)
      </Small>

      {fileRejections.length > 0 && (
        <Small color="error.main" mt="1rem">
          You can only upload a maximum of 2 documents.
        </Small>
      )}
    </Box>
  );
}
