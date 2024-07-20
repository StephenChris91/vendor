"use client";

import { useState, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";
import { submitVerificationDocuments } from "actions/submitVerificationDocuments";

import { StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import { H3, H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import Image from "next/image";
import { uploadFileToS3 } from "actions/upload-signUrl";

interface FormValues {
  document: File | null;
}

const UploadVerificationDocuments = ({ userId, userEmail, onComplete }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const formSchema = yup.object().shape({
    document: yup
      .mixed()
      .required("A verification document is required")
      .test(
        "fileFormat",
        "Unsupported file format. Please upload a PDF or image file.",
        (value) => {
          if (value instanceof File) {
            return (
              value.type.startsWith("image/") ||
              value.type === "application/pdf"
            );
          }
          return false;
        }
      ),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      document: null,
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      if (!values.document) return;

      try {
        const file = values.document;
        const fileName = `verification-${userId}-${Date.now()}.${file.name
          .split(".")
          .pop()}`;

        // Convert File to base64
        const base64 = await fileToBase64(file);

        // Upload to S3
        const uploadedUrl = await uploadFileToS3(base64, fileName, userId);

        // Submit for verification
        await submitVerificationDocuments(
          userId,
          userEmail,
          uploadedUrl,
          fileType!
        );

        toast.success("Document submitted successfully for verification!");
        onComplete();
      } catch (error) {
        console.error("Error submitting document:", error);
        toast.error("Failed to submit document. Please try again.");
      }
    },
  });

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the data URL prefix (e.g., "data:image/png;base64,")
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        formik.setFieldValue("document", file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Set file type
        setFileType(file.type.startsWith("image/") ? "image" : "pdf");
      }
    },
    [formik]
  );

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <Box className="content">
        <H3 textAlign="center" mb="0.5rem">
          Upload Verification Document
        </H3>

        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Please upload an image or PDF document for verification
        </H5>

        <DropZone onChange={handleFileChange} />

        {formik.touched.document && formik.errors.document && (
          <Small color="error.main" mt="0.5rem">
            {formik.errors.document}
          </Small>
        )}

        {previewUrl && (
          <Box mt="2rem">
            <H5 mb="0.5rem">Preview:</H5>
            {fileType === "image" ? (
              <Image
                src={previewUrl}
                alt="Document Preview"
                width={300}
                height={300}
                objectFit="contain"
              />
            ) : (
              <Small>PDF document uploaded (preview not available)</Small>
            )}
          </Box>
        )}

        <Button
          mt="2rem"
          variant="contained"
          color="primary"
          fullwidth
          onClick={() => formik.handleSubmit()}
          disabled={!formik.values.document || formik.isSubmitting}
        >
          {formik.isSubmitting
            ? "Submitting..."
            : "Submit Document for Verification"}
        </Button>
      </Box>
    </StyledRoot>
  );
};

export default UploadVerificationDocuments;
