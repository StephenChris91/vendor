"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import { uploadFileToS3 } from "actions/upload-signUrl";

interface AddCoverImageProps {
  updateFormData: (data: { coverImage: string }) => void;
  initialCoverImage: string;
  userName: string;
  userId: string;
}

const AddCoverImage: React.FC<AddCoverImageProps> = ({
  updateFormData,
  initialCoverImage,
  userName,
  userId,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const formSchema = yup.object().shape({
    coverImage: yup.string().required("Cover image is required"),
  });

  const formik = useFormik({
    initialValues: {
      coverImage: initialCoverImage || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({ coverImage: values.coverImage });
    },
  });

  useEffect(() => {
    if (initialCoverImage && initialCoverImage !== formik.values.coverImage) {
      formik.setFieldValue("coverImage", initialCoverImage);
    }
  }, [initialCoverImage]);

  const handleImageChange = useCallback(
    async (files: File[]) => {
      if (files && files.length > 0) {
        const file = files[0];
        setIsUploading(true);

        try {
          const base64 = await fileToBase64(file);
          const fileName = `cover-image-${userId}-${Date.now()}.${file.name
            .split(".")
            .pop()}`;
          const uploadedUrl = await uploadFileToS3(base64, fileName, userName);

          formik.setFieldValue("coverImage", uploadedUrl);
          await formik.submitForm();

          toast.success("Cover image uploaded successfully!");
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image. Please try again.");
        } finally {
          setIsUploading(false);
        }
      }
    },
    [formik, userName, userId]
  );

  return (
    <Box className="content" width="auto" height="auto" paddingBottom={6}>
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

      {formik.values.coverImage && (
        <Box mt="2rem">
          <H5 mb="0.5rem">Preview:</H5>
          <Image
            src={formik.values.coverImage}
            alt="Cover Image Preview"
            width={300}
            height={150}
            objectFit="cover"
          />
          <Button
            mt="1rem"
            variant="outlined"
            color="primary"
            onClick={() => {
              formik.setFieldValue("coverImage", "");
              formik.submitForm();
            }}
          >
            Remove Image
          </Button>
        </Box>
      )}
    </Box>
  );
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result.split(",")[1]);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export default AddCoverImage;
