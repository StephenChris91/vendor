"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import Image from "@component/Image";
import { uploadFileToS3 } from "actions/upload-signUrl";

interface AddCoverImageProps {
  updateFormData: (data: { banner: string }) => void;
  initialCoverImage: string;
  userName: string;
  userId: string;
}

const validationSchema = Yup.object().shape({
  coverImage: Yup.string().required("Shop cover image is required"),
});

const AddCoverImage: React.FC<AddCoverImageProps> = ({
  updateFormData,
  initialCoverImage,
  userName,
  userId,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      coverImage: initialCoverImage || "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData({ banner: values.coverImage });
    },
  });

  useEffect(() => {
    if (initialCoverImage && initialCoverImage !== formik.values.coverImage) {
      formik.setFieldValue("coverImage", initialCoverImage);
    }
  }, [initialCoverImage]);

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scaleFactor = 0.7; // Adjust this value to change compression level
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Canvas to Blob conversion failed"));
              }
            },
            "image/jpeg",
            0.8 // Adjust this value to change compression quality
          );
        };
        img.onerror = () => reject(new Error("Image loading failed"));
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const file = files[0];
      setIsUploading(true);

      try {
        const compressedBlob = await compressImage(file);
        const base64 = await blobToBase64(compressedBlob);
        const fileName = `shop-cover-${userId}-${Date.now()}.jpg`;
        const uploadedUrl = await uploadFileToS3(base64, fileName, userName);

        formik.setFieldValue("coverImage", uploadedUrl);
        updateFormData({ banner: uploadedUrl });
        toast.success("Shop cover image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading cover image:", error);
        toast.error("Failed to upload cover image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [formik, userId, userName, updateFormData]
  );

  const handleRemoveCoverImage = () => {
    formik.setFieldValue("coverImage", "");
    updateFormData({ banner: "" });
  };

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

      <DropZone onChange={handleImageUpload} />

      {formik.touched.coverImage && formik.errors.coverImage && (
        <Small color="error.main" mt="0.5rem">
          {formik.errors.coverImage}
        </Small>
      )}

      {isUploading && (
        <Small color="text.muted" mt="1rem">
          Uploading cover image...
        </Small>
      )}

      {formik.values.coverImage && (
        <Box mt="2rem">
          <H5 mb="0.5rem">Preview:</H5>
          <Image
            src={formik.values.coverImage}
            alt="Shop Cover Image Preview"
            width={300}
            height={150}
            style={{ objectFit: "cover" }}
          />
          <Button
            mt="1rem"
            variant="outlined"
            color="primary"
            onClick={handleRemoveCoverImage}
          >
            Remove Cover Image
          </Button>
        </Box>
      )}
    </Box>
  );
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export default AddCoverImage;
