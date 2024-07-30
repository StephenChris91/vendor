import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";

import Card from "@component/Card";
import Image from "@component/Image";
import Select, { SelectOption } from "@component/Select";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import DropZone from "@component/DropZone";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";

import Product from "@models/product.model";
import { createProduct } from "actions/creatProducts";
import toast from "react-hot-toast";
import { uploadProductToS3 } from "actions/upload-product-image";

// STYLED COMPONENT
const UploadImageBox = styled("div")(({ theme }) => ({
  width: 70,
  height: 70,
  display: "flex",
  overflow: "hidden",
  borderRadius: "8px",
  marginRight: ".5rem",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colors.primary[100],
}));

interface Props {
  product?: Product;
  categoryOptions: SelectOption[];
}

interface FormValues {
  name: string;
  price: number;
  stock: number;
  sale_price: number;
  description: string;
  category: SelectOption[] | null;
}

export default function ProductUpdateForm({ product, categoryOptions }: Props) {
  // Convert product categories to SelectOption format
  const initialCategories: SelectOption[] =
    product?.categories?.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) || null;

  const initialValues: FormValues = {
    name: product?.name || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    sale_price: product?.sale_price || 0,
    description: product?.description || "",
    category: initialCategories,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    category: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().required(),
          label: yup.string().required(),
        })
      )
      .min(1, "At least one category is required"),
    description: yup.string().required("Description is required"),
    stock: yup
      .number()
      .required("Stock is required")
      .positive("Stock must be positive"),
    price: yup
      .number()
      .required("Price is required")
      .positive("Price must be positive"),
    sale_price: yup.number().positive("Sale price must be positive"),
    tags: yup.string().required("Tags are required"),
  });

  const handleFormSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log(values, "form submitting started");
    const createdProduct = await createProduct(values);
    if (createdProduct.status === "success") {
      toast.success("Product created successfully");
    } else if (createdProduct.status === "error") {
      toast.error("Failed to create product");
    }

    setSubmitting(false);
  };

  return (
    <Card p="30px" borderRadius={8}>
      <Formik
        onSubmit={(values, helpers) => {
          console.log("Formik onSubmit triggered");
          return handleFormSubmit(values, helpers);
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          isSubmitting,
          submitForm,
          isValid,
        }) => (
          <Form>
            <Grid container spacing={6}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  name="name"
                  label="Name"
                  placeholder="Product Name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  errorText={touched.name && errors.name}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <Select
                  isMulti
                  label="Category"
                  placeholder="Select Categories"
                  options={categoryOptions}
                  value={values.category}
                  onChange={(option) => setFieldValue("category", option)}
                  errorText={touched.category && (errors.category as string)}
                />
              </Grid>

              <Grid item xs={12}>
                <DropZone
                  onChange={(files) => {
                    console.log(files);
                    // uploadProductToS3(files);
                    // Here you would typically handle file uploads
                  }}
                />

                <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                  {product?.gallery?.map((item, i) => (
                    <UploadImageBox key={i}>
                      <Image src={item} width="100%" />
                    </UploadImageBox>
                  ))}
                </FlexBox>
              </Grid>

              <Grid item xs={12}>
                <TextArea
                  rows={6}
                  fullwidth
                  name="description"
                  label="Description"
                  placeholder="Product Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  errorText={touched.description && errors.description}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  name="stock"
                  label="Stock"
                  placeholder="Available Stock"
                  type="number"
                  onBlur={handleBlur}
                  value={values.stock}
                  onChange={handleChange}
                  errorText={touched.stock && errors.stock}
                />
              </Grid>

              {/* <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  name="tags"
                  label="Tags"
                  placeholder="Product Tags"
                  value={values.tags}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  errorText={touched.tags && errors.tags}
                />
              </Grid> */}

              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  name="price"
                  type="number"
                  label="Regular Price"
                  placeholder="Regular Price"
                  onBlur={handleBlur}
                  value={values.price}
                  onChange={handleChange}
                  errorText={touched.price && errors.price}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullwidth
                  type="number"
                  name="sale_price"
                  label="Sale Price"
                  placeholder="Sale Price"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.sale_price}
                  errorText={touched.sale_price && errors.sale_price}
                />
              </Grid>
            </Grid>

            <Button
              mt="25px"
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              onClick={() => console.log("Button clicked")}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
