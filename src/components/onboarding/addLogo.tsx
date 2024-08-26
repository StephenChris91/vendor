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
  setStepValidation: (isValid: boolean) => void;
}

const validationSchema = Yup.object().shape({
  logo: Yup.string().required("Shop logo is required"),
});

const AddLogo: React.FC<AddLogoProps> = ({
  updateFormData,
  initialLogo,
  userName,
  userId,
  setStepValidation,
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
    validate: (values) => {
      try {
        validationSchema.validateSync(values);
        setStepValidation(true);
        return {};
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setStepValidation(false);
          return { [error.path as string]: error.message };
        }
        return {};
      }
    },
  });

  useEffect(() => {
    if (initialLogo && initialLogo !== formik.values.logo) {
      formik.setFieldValue("logo", initialLogo);
    }
  }, [initialLogo]);

  useEffect(() => {
    formik.validateForm();
  }, []);

  const handleUpload = useCallback(
    (url: string) => {
      setIsUploading(false);
      formik.setFieldValue("logo", url);
      updateFormData({ logo: url });
      toast.success("Shop logo uploaded successfully!");
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
        uploadType="shop-logo"
        maxSize={4 * 1024 * 1024}
        acceptedFileTypes={{
          "image/png": [".png"],
          "image/jpeg": [".jpg", ".jpeg"],
          "image/gif": [".gif"],
          "image/webp": [".webp"],
        }}
        multiple={false}
        onUpload={handleUpload}
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
