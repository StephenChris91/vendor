"use client";

import { useFormik } from "formik";
import * as yup from "yup";

import { StyledRoot } from "@sections/auth/styles";
import TextField from "@component/text-field";
import { H3, H5 } from "@component/Typography";

const AddBasicInfo = ({ updateFormData, shopName, slug, description }) => {
  const formSchema = yup.object().shape({
    shopName: yup.string().required("Shop name is required"),
    slug: yup
      .string()
      .matches(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
      )
      .required("Slug is required"),
    description: yup.string().required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      shopName: shopName || "",
      slug: slug || "",
      description: description || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData(values);
    },
  });

  const handleBlur = (e) => {
    formik.handleBlur(e);
    formik.submitForm(); // This will trigger onSubmit and update the parent form data
  };

  const handleChange = (e) => {
    formik.handleChange(e);
    formik.submitForm(); // This will trigger onSubmit and update the parent form data
  };

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <form className="content">
        <H3 textAlign="center" mb="0.5rem">
          Shop Details
        </H3>

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
          onBlur={handleBlur}
          value={formik.values.slug}
          onChange={handleChange}
          errorText={formik.touched.slug && formik.errors.slug}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="description"
          label="Description"
          onBlur={handleBlur}
          value={formik.values.description}
          onChange={handleChange}
          errorText={formik.touched.description && formik.errors.description}
          multiline
          rows={4}
        />
      </form>
    </StyledRoot>
  );
};

export default AddBasicInfo;
