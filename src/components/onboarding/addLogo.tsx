"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
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
      logo: initialLogo || "",
    },
    validationSchema,
    onSubmit: (values) => {
      updateFormData({ logo: values.logo });
    },
  });

  useEffect(() => {
    if (initialLogo && initialLogo !== formik.values.logo) {
      formik.setFieldValue("logo", initialLogo);
    }
  }, [initialLogo]);

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
    [formik, userId, userName]
  );

  const handleRemoveLogo = () => {
    formik.setFieldValue("logo", "");
    formik.submitForm();
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
            width={50}
            height={50}
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

export default AddLogo;
