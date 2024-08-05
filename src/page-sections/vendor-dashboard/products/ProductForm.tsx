import React, { useState, useEffect } from "react";
import styled from "styled-components";
import * as yup from "yup";
import { Formik, Form, FormikHelpers } from "formik";

import Card from "@component/Card";
import Image from "@component/Image";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import TextArea from "@component/textarea";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import DropZone from "@component/DropZone";
import Product from "@models/product.model";
import { createProduct } from "actions/creatProducts";
import toast from "react-hot-toast";
import CheckBox from "@component/CheckBox";
import Select, { SelectOption } from "@component/Select";

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
}

interface FormValues {
  name: string;
  price: number;
  stock: number;
  sale_price: number;
  description: string;
  categories: SelectOption[];
  in_stock: boolean;
  is_taxable: boolean;
  image: string;
  slug: string;
  sku: number;
  quantity: number;
  status: "Draft" | "Published" | "Suspended" | "OutOfStock";
  product_type: "Simple" | "Variable";
}

const statusOptions: SelectOption[] = [
  { value: "Draft", label: "Draft" },
  { value: "Published", label: "Published" },
  { value: "Suspended", label: "Suspended" },
  { value: "OutOfStock", label: "Out of Stock" },
];

const productTypeOptions: SelectOption[] = [
  { value: "Simple", label: "Simple" },
  { value: "Variable", label: "Variable" },
];

export default function ProductUpdateForm({ product }: Props) {
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories/get-categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const categories = await response.json();
      setCategoryOptions(
        categories.map((cat: any) => ({ value: cat.id, label: cat.name }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  const generateSKU = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  const initialValues: FormValues = {
    name: product?.name || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    sale_price: product?.sale_price || 0,
    description: product?.description || "",
    categories:
      product?.categories?.map((cat) => ({ value: cat.id, label: cat.name })) ||
      [],
    in_stock: product?.in_stock || false,
    is_taxable: product?.is_taxable || false,
    image: product?.image || "",
    slug: product?.slug || "",
    sku: product?.sku || 0,
    quantity: product?.quantity || 0,
    status: product?.status || "Draft",
    product_type: product?.product_type || "Simple",
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    categories: yup.array().min(1, "At least one category is required"),
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
    in_stock: yup.boolean().required("In Stock status is required"),
    is_taxable: yup.boolean().required("Taxable status is required"),
    image: yup.string().required("Product image is required"),
    slug: yup.string().required("Slug is required"),
    sku: yup.number().required("SKU is required"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
    status: yup
      .string()
      .oneOf(["Draft", "Published", "Suspended", "OutOfStock"])
      .required("Status is required"),
    product_type: yup
      .string()
      .oneOf(["Simple", "Variable"])
      .required("Product type is required"),
  });

  const handleFormSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log(values, "form submitting started");

    // Transform categories to match the expected format
    const transformedValues = {
      ...values,
      categories: values.categories.map((cat) => cat.value),
    };

    const createdProduct = await createProduct(transformedValues);
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
        onSubmit={handleFormSubmit}
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
        }) => {
          const handleUpload = (url: string) => {
            setFieldValue("image", url);
          };

          return (
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
                    options={categoryOptions}
                    value={values.categories}
                    onChange={(newValue) =>
                      setFieldValue("categories", newValue)
                    }
                    label="Categories"
                    placeholder="Select Categories"
                    errorText={
                      touched.categories && (errors.categories as string)
                    }
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullwidth
                    name="slug"
                    label="Slug"
                    placeholder="product-slug"
                    value={values.slug}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    errorText={touched.slug && errors.slug}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullwidth
                    name="sku"
                    label="SKU"
                    placeholder="SKU"
                    type="number"
                    value={values.sku}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    errorText={touched.sku && errors.sku}
                  />
                  <Button
                    mt="0.5rem"
                    color="primary"
                    variant="outlined"
                    onClick={() => setFieldValue("sku", generateSKU())}
                  >
                    Generate SKU
                  </Button>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullwidth
                    name="quantity"
                    label="Quantity"
                    placeholder="Quantity"
                    type="number"
                    value={values.quantity}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    errorText={touched.quantity && errors.quantity}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === values.status
                    )}
                    onChange={(option) =>
                      setFieldValue("status", option?.value)
                    }
                    label="Status"
                    placeholder="Select Status"
                    errorText={touched.status && errors.status}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <Select
                    options={productTypeOptions}
                    value={productTypeOptions.find(
                      (option) => option.value === values.product_type
                    )}
                    onChange={(option) =>
                      setFieldValue("product_type", option?.value)
                    }
                    label="Product Type"
                    placeholder="Select Product Type"
                    errorText={touched.product_type && errors.product_type}
                  />
                </Grid>

                <Grid item xs={12}>
                  <DropZone
                    onChange={handleUpload}
                    uploadType="product-image"
                    maxSize={4 * 1024 * 1024} // 4MB limit
                    acceptedFileTypes={[
                      "image/jpeg",
                      "image/png",
                      "image/webp",
                    ]}
                    multiple={false}
                  />
                  {values.image && (
                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                      <UploadImageBox>
                        <Image src={values.image} width="100%" />
                      </UploadImageBox>
                    </FlexBox>
                  )}
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

                <Grid item sm={6} xs={12}>
                  <CheckBox
                    name="in_stock"
                    label="In Stock"
                    checked={values.in_stock}
                    onChange={(e) =>
                      setFieldValue("in_stock", e.target.checked)
                    }
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <CheckBox
                    name="is_taxable"
                    label="Taxable"
                    checked={values.is_taxable}
                    onChange={(e) =>
                      setFieldValue("is_taxable", e.target.checked)
                    }
                  />
                </Grid>
              </Grid>

              <Button
                mt="25px"
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Save Product
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}
