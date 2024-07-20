"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import { H3, H5, Small } from "@component/Typography";
import DropZone from "@component/DropZone";
import { Button } from "@component/buttons";
import { uploadFileToS3 } from "actions/upload-signUrl";

interface AddLogoProps {
  updateFormData: (data: { logo: string }) => void;
  initialLogo: string;
  userName: string;
  userId: string;
}

const validationSchema = Yup.object().shape({
  logo: Yup.string().required("Shop logo is required"),
});

const AddLogo: React.FC<AddLogoProps> = ({
  updateFormData,
  initialLogo,
  userName,
  userId,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      logo: initialLogo,
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData({ logo: values.logo });
    },
  });

  const handleImageUpload = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const file = files[0];
      setIsUploading(true);

      try {
        const base64 = await fileToBase64(file);
        const fileName = `shop-logo-${userId}-${Date.now()}.${file.name
          .split(".")
          .pop()}`;
        const uploadedUrl = await uploadFileToS3(base64, fileName, userName);

        formik.setFieldValue("logo", uploadedUrl);
        await formik.submitForm();

        toast.success("Shop logo uploaded successfully!");
      } catch (error) {
        console.error("Error uploading logo:", error);
        toast.error("Failed to upload logo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [formik, userId, userName, updateFormData]
  );

  const handleRemoveLogo = () => {
    formik.setFieldValue("logo", "");
    formik.submitForm();
  };

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <Box className="content" padding="2rem">
        <H3 textAlign="center" mb="0.5rem">
          Upload Shop Logo
        </H3>
        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Upload a logo for your shop
        </H5>

        <DropZone onChange={handleImageUpload} />

        {formik.touched.logo && formik.errors.logo && (
          <Small color="error.main" mt="0.5rem">
            {formik.errors.logo}
          </Small>
        )}

        {isUploading && (
          <Small color="text.muted" mt="1rem">
            Uploading logo...
          </Small>
        )}

        {formik.values.logo && (
          <Box mt="2rem">
            <H5 mb="0.5rem">Preview:</H5>
            <Image
              src={formik.values.logo}
              alt="Shop Logo Preview"
              width={200}
              height={200}
              objectFit="contain"
            />
            <Button
              mt="1rem"
              variant="outlined"
              color="primary"
              onClick={handleRemoveLogo}
            >
              Remove Logo
            </Button>
          </Box>
        )}
      </Box>
    </StyledRoot>
  );
};

// Helper function to convert File to base64
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

export default AddLogo;
