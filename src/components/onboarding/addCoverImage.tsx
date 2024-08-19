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

  const handleUpload = useCallback(
    (url: string) => {
      setIsUploading(false);
      formik.setFieldValue("coverImage", url);
      updateFormData({ banner: url });
      toast.success("Shop cover image uploaded successfully!");
    },
    [formik, updateFormData]
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

      <DropZone
        uploadType="shop-banner"
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

export default AddCoverImage;
