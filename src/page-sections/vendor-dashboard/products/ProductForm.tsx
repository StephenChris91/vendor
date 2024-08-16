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
import Typography from "@component/Typography";

// const UploadImageBox = styled("div")(({ theme }) => ({
//   width: 70,
//   height: 70,
//   display: "flex",
//   overflow: "hidden",
//   borderRadius: "8px",
//   marginRight: ".5rem",
//   position: "relative",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: theme.colors.primary[100],
// }));

const StyledDropZone = styled(DropZone)`
  width: 100%;
  min-height: 200px;
  margin-bottom: 20px;
`;

const StyledLabel = styled(Typography)`
  margin-bottom: 10px;
  font-weight: 600;
`;
interface Props {
  product?: Product;
  categoryOptions: SelectOption[];
  brandOptions: SelectOption[];
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  sku: number;
  quantity: number;
  in_stock: boolean;
  is_taxable: boolean;
  status: "Draft" | "Published" | "Suspended" | "OutOfStock";
  product_type: "Simple" | "Variable";
  image: string;
  gallery: string[];
  categories: SelectOption[];
  brandId: string | null;
  isFlashDeal: boolean;
  discountPercentage: number | null;
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

export default function ProductUpdateForm({
  product,
  categoryOptions: initialCategoryOptions,
  brandOptions: initialBrandOptions,
}: Props) {
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [categoryOption, setCategoryOption] = useState(initialCategoryOptions);
  const [selectBrandOptions, setSelectBrandOptions] =
    useState(initialBrandOptions);

  const generateSKU = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^-+|-+$/g, "");
  };

  const handleCreateCategory = (inputValue: string) => {
    const newCategory = { value: inputValue.toLowerCase(), label: inputValue };
    setCategoryOption((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const handleCreateBrand = (inputValue: string) => {
    const newBrand = { value: inputValue.toLowerCase(), label: inputValue };

    setSelectBrandOptions((prev) =>
      Array.isArray(prev) ? [...prev, newBrand] : [newBrand]
    );

    return newBrand;
  };

  const checkSlugUniqueness = async (slug: string) => {
    try {
      const response = await fetch(`/api/products/check-slug?slug=${slug}`);
      if (!response.ok) throw new Error("Failed to check slug uniqueness");
      const { isUnique } = await response.json();
      setIsSlugUnique(isUnique);
      return isUnique;
    } catch (error) {
      console.error("Error checking slug uniqueness:", error);
      toast.error("Failed to check slug uniqueness");
      return false;
    }
  };

  const initialValues: FormValues = {
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    sale_price: product?.sale_price || 0,
    sku: product?.sku || 0,
    quantity: product?.quantity || 0,
    in_stock: product?.in_stock || false,
    is_taxable: product?.is_taxable || false,
    status: product?.status || "Draft",
    product_type: product?.product_type || "Simple",
    image: product?.image || "",
    gallery: product?.gallery || [],
    categories:
      product?.categories?.map((pc) => ({
        value: pc.categoryId,
        label:
          categoryOption.find((cat) => cat.value === pc.categoryId)?.label ||
          "",
      })) || [],
    brandId: product?.brandId || null,
    isFlashDeal: product?.isFlashDeal || false,
    discountPercentage: product?.discountPercentage || null,
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    slug: yup.string().required("Slug is required"),
    description: yup.string().required("Description is required"),
    price: yup
      .number()
      .required("Price is required")
      .positive("Price must be positive"),
    sale_price: yup.number().positive("Sale price must be positive"),
    sku: yup.number().required("SKU is required"),
    quantity: yup
      .number()
      .required("Quantity is required")
      .positive("Quantity must be positive"),
    in_stock: yup.boolean().required("In Stock status is required"),
    is_taxable: yup.boolean().required("Taxable status is required"),
    status: yup
      .string()
      .oneOf(["Draft", "Published", "Suspended", "OutOfStock"])
      .required("Status is required"),
    product_type: yup
      .string()
      .oneOf(["Simple", "Variable"])
      .required("Product type is required"),
    image: yup.string().required("Product image is required"),
    gallery: yup.array().of(yup.string()),
    categories: yup.array().min(1, "At least one category is required"),
    brandId: yup.string().nullable(),
    isFlashDeal: yup.boolean(),
    discountPercentage: yup.number().nullable().min(0).max(100),
  });

  const handleFormSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    if (!isSlugUnique) {
      toast.error("Slug is not unique. Please modify the product name.");
      setSubmitting(false);
      return;
    }

    console.log(values, "form submitting started");

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

          const handleGalleryUpload = async (files: File[]) => {
            // This function should handle file uploads and return URLs
            const uploadFile = async (file: File): Promise<string> => {
              return URL.createObjectURL(file);
            };

            try {
              const uploadPromises = files.map((file) => uploadFile(file));
              const urls = await Promise.all(uploadPromises);
              setFieldValue("gallery", [...values.gallery, ...urls]);
            } catch (error) {
              console.error("Error uploading files:", error);
              toast.error("Failed to upload one or more files");
            }
          };

          const handleNameChange = async (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const name = e.target.value;
            handleChange(e);
            const newSlug = generateSlug(name);
            setFieldValue("slug", newSlug);
            const isUnique = await checkSlugUniqueness(newSlug);
            setIsSlugUnique(isUnique);
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
                    onChange={handleNameChange}
                    errorText={touched.name && errors.name}
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
                    disabled
                  />
                  {!isSlugUnique && (
                    <p style={{ color: "red" }}>
                      This slug is not unique. Please modify the product name.
                    </p>
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

                <Grid item sm={6} xs={12}>
                  <Select
                    options={statusOptions}
                    value={
                      statusOptions.find(
                        (option) => option.value === values.status
                      ) || null
                    }
                    onChange={(newValue) =>
                      setFieldValue(
                        "status",
                        (newValue as SelectOption)?.value || ""
                      )
                    }
                    label="Status"
                    placeholder="Select Status"
                    errorText={touched.status && errors.status}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <Select
                    options={productTypeOptions}
                    value={
                      productTypeOptions.find(
                        (option) => option.value === values.product_type
                      ) || null
                    }
                    onChange={(newValue) =>
                      setFieldValue(
                        "product_type",
                        (newValue as SelectOption)?.value || ""
                      )
                    }
                    label="Product Type"
                    placeholder="Select Product Type"
                    errorText={touched.product_type && errors.product_type}
                  />

                  {/* <Grid item xs={12}>
                    <TextField
                      fullwidth
                      name="video"
                      label="Video URL"
                      placeholder="Product Video URL"
                      value={values.video}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      errorText={touched.video && errors.video}
                    />
                  </Grid> */}

                  <Grid item xs={12}>
                    <StyledLabel>Product Image</StyledLabel>
                    <StyledDropZone
                      onChange={handleUpload}
                      uploadType="product-image"
                      maxSize={4 * 1024 * 1024} // 4MB limit
                      acceptedFileTypes={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/gif": [".gif"],
                        "image/webp": [".webp"],
                      }}
                      multiple={false}
                    />
                    {values.image && (
                      <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                        <Image src={values.image} width={100} height={100} />
                      </FlexBox>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <StyledLabel>Product Gallery</StyledLabel>
                    <StyledDropZone
                      onChange={handleGalleryUpload}
                      uploadType="product-gallery"
                      maxSize={4 * 1024 * 1024} // 4MB limit
                      acceptedFileTypes={{
                        "image/png": [".png"],
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/gif": [".gif"],
                        "image/webp": [".webp"],
                      }}
                      multiple={true}
                    />
                    {values.gallery.length > 0 && (
                      <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                        {values.gallery.map((img, index) => (
                          <Image
                            key={index}
                            src={img}
                            width={100}
                            height={100}
                            // objectFit="cover"
                            m={1}
                          />
                        ))}
                      </FlexBox>
                    )}
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Select
                      isMulti
                      isCreatable
                      options={categoryOption}
                      value={values.categories}
                      onChange={(newValue) =>
                        setFieldValue("categories", newValue)
                      }
                      onCreateOption={(inputValue) => {
                        const newCategory = handleCreateCategory(inputValue);
                        setFieldValue("categories", [
                          ...values.categories,
                          newCategory,
                        ]);
                      }}
                      label="Categories"
                      placeholder="Select or Create Categories"
                      errorText={
                        touched.categories && (errors.categories as string)
                      }
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <Select
                      isCreatable
                      options={selectBrandOptions}
                      value={
                        selectBrandOptions?.find(
                          (option) => option.value === values.brandId
                        ) || null
                      }
                      onChange={(newValue) =>
                        setFieldValue(
                          "brandId",
                          (newValue as SelectOption)?.value || null
                        )
                      }
                      onCreateOption={(inputValue) => {
                        const newBrand = handleCreateBrand(inputValue);
                        setFieldValue("brandId", newBrand?.label);
                      }}
                      label="Brand"
                      placeholder="Select or Create Brand"
                      errorText={touched.brandId && errors.brandId}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <CheckBox
                      name="isFlashDeal"
                      label="Flash Deal"
                      checked={values.isFlashDeal}
                      onChange={(e) =>
                        setFieldValue("isFlashDeal", e.target.checked)
                      }
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullwidth
                      name="discountPercentage"
                      label="Discount Percentage"
                      placeholder="Discount Percentage"
                      type="number"
                      value={values.discountPercentage || ""}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      errorText={
                        touched.discountPercentage && errors.discountPercentage
                      }
                      disabled={!values.isFlashDeal}
                    />
                  </Grid>
                </Grid>

                <Button
                  mt="25px"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting || !isSlugUnique}
                >
                  {product ? "Update Product" : "Create Product"}
                </Button>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}
