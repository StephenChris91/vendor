"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { StyledRoot } from "@sections/auth/styles";
import TextField from "@component/text-field";
import TextArea from "@component/textarea";
import { H3, H5 } from "@component/Typography";

interface AddBasicInfoProps {
  updateFormData: (data: {
    shopName: string;
    slug: string;
    description: string;
  }) => void;
  initialShopName: string;
  initialSlug: string;
  initialDescription: string;
  setStepValidation: (isValid: boolean) => void;
}

const AddBasicInfo: React.FC<AddBasicInfoProps> = ({
  updateFormData,
  initialShopName,
  initialSlug,
  initialDescription,
  setStepValidation,
}) => {
  const formSchema = yup.object().shape({
    shopName: yup.string().required("Shop name is required"),
    slug: yup
      .string()
      .matches(
        /^[a-z0-9_]+$/,
        "Slug must contain only lowercase letters, numbers, and underscores"
      )
      .required("Slug is required"),
    description: yup
      .string()
      .max(120, "Description must be at most 120 characters")
      .required("Description is required"),
  });

  const generateSlug = (shopName: string) => {
    return shopName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const formik = useFormik({
    initialValues: {
      shopName: initialShopName || "",
      slug: initialSlug || "",
      description: initialDescription || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({
        shopName: values.shopName,
        slug: values.slug,
        description: values.description,
      });
    },
    validate: (values) => {
      try {
        formSchema.validateSync(values, { abortEarly: false });
        setStepValidation(true);
        return {};
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          err.inner.forEach((error) => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
          setStepValidation(false);
          return errors;
        }
        return {};
      }
    },
  });

  useEffect(() => {
    const newSlug = generateSlug(formik.values.shopName);
    formik.setFieldValue("slug", newSlug);
  }, [formik.values.shopName]);

  useEffect(() => {
    formik.validateForm();
  }, []);

  const handleBlur = (e: React.FocusEvent<any>) => {
    formik.handleBlur(e);
    formik.submitForm();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    formik.handleChange(e);
    formik.submitForm();
  };

  return (
    <form className="content">
      <H5
        fontWeight="600"
        fontSize="12px"
        color="gray.800"
        textAlign="center"
        mb="2.25rem"
      >
        Please fill all fields to continue
      </H5>

      <TextField
        fullwidth
        mb="0.75rem"
        name="shopName"
        label="Shop Name"
        onBlur={handleBlur}
        value={formik.values.shopName}
        onChange={handleChange}
        errorText={formik.touched.shopName && formik.errors.shopName}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="slug"
        label="Slug"
        value={formik.values.slug}
        onChange={handleChange}
        errorText={formik.touched.slug && formik.errors.slug}
        disabled
      />

      <TextArea
        fullwidth
        mb="0.75rem"
        name="description"
        label="Description"
        onBlur={handleBlur}
        value={formik.values.description}
        onChange={handleChange}
        errorText={formik.touched.description && formik.errors.description}
        maxLength={120}
      />

      <small>{formik.values.description.length}/120 characters</small>
    </form>
  );
};

export default AddBasicInfo;
