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
    (result: string | File[]) => {
      if (typeof result === "string") {
        formik.setFieldValue("logo", result);
        updateFormData({ logo: result });
        toast.success("Shop logo uploaded successfully!");
      } else {
        console.error("Unexpected result type from DropZone");
        toast.error("Failed to upload logo. Please try again.");
      }
    },
    [formik, updateFormData]
  );

  const handleRemoveLogo = () => {
    formik.setFieldValue("logo", "");
    updateFormData({ logo: "" });
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

      <DropZone
        onChange={handleImageUpload}
        uploadType="shop-logo"
        useS3={true}
        multiple={false}
        acceptedFileTypes={{
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
          "image/gif": [".gif"],
          "image/webp": [".webp"],
        }}
      />

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
            width={150}
            height={150}
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

export default AddLogo;
