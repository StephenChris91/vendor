"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import { StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import { H3, H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import { uploadFileToS3 } from "actions/upload-signUrl";

const AddCoverImage = ({ updateFormData, coverImage, userName }) => {
  const [previewImage, setPreviewImage] = useState(coverImage || null);
  const [isUploading, setIsUploading] = useState(false);

  const formSchema = yup.object().shape({
    coverImage: yup.string().required("Cover image is required"),
  });

  const formik = useFormik({
    initialValues: {
      coverImage: coverImage || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData(values);
    },
  });

  const handleImageChange = useCallback(
    async (files: File[]) => {
      if (files && files.length > 0) {
        const file = files[0];
        setIsUploading(true);

        try {
          // Create a preview
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              setPreviewImage(reader.result);
            }
          };
          reader.readAsDataURL(file);

          // Convert file to base64
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === "string") {
                resolve(reader.result.split(",")[1]);
              } else {
                resolve(""); // Fallback to empty string if result is not a string
              }
            };
            reader.readAsDataURL(file);
          });

          // Upload to S3
          const fileName = `cover-image-${Date.now()}.jpg`;
          const uploadedUrl = await uploadFileToS3(base64, fileName, userName);

          // Update form values
          formik.setFieldValue("coverImage", uploadedUrl);
          formik.submitForm();

          toast.success("Cover image uploaded successfully!");
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image. Please try again.");
        } finally {
          setIsUploading(false);
        }
      }
    },
    [formik, userName]
  );

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <Box className="content">
        <H3 textAlign="center" mb="0.5rem">
          Upload Cover Image
        </H3>

        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Upload a cover image for your shop
        </H5>

        <DropZone onChange={handleImageChange} />

        {formik.touched.coverImage && formik.errors.coverImage && (
          <Small color="error.main" mt="0.5rem">
            {formik.errors.coverImage}
          </Small>
        )}

        {isUploading && (
          <Small color="text.muted" mt="1rem">
            Uploading image...
          </Small>
        )}

        {previewImage && (
          <Box mt="2rem">
            <H5 mb="0.5rem">Preview:</H5>
            <Image
              src={previewImage}
              alt="Cover Image Preview"
              width={800}
              height={400}
              objectFit="cover"
            />
          </Box>
        )}

        {previewImage && (
          <Button
            mt="1rem"
            variant="outlined"
            color="primary"
            onClick={() => {
              setPreviewImage(null);
              formik.setFieldValue("coverImage", "");
              formik.submitForm();
            }}
          >
            Remove Image
          </Button>
        )}
      </Box>
    </StyledRoot>
  );
};

export default AddCoverImage;
