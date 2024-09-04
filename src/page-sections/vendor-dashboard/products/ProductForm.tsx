"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Formik, Form, FormikHelpers } from "formik";
import { useRouter } from "next/navigation";
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
import { validationSchema } from "schemas";
import { uploadToS3 } from "@utils/s3Client";
import { LuHash } from "react-icons/lu";
import { updateProduct } from "actions/update-product";
import { primaryCategories } from "@data/primary-categories";
import { popularBrands } from "@data/primary-brands";

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
  isFlashDeal?: boolean;
  discountPercentage?: number | null;
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

const categoryOptions: SelectOption[] = primaryCategories.map((category) => ({
  value: category.toLowerCase().replace(/\s+/g, "-"),
  label: category,
}));

export default function ProductUpdateForm({
  product,
  categoryOptions: initialCategoryOptions,
  brandOptions: initialBrandOptions,
}: Props) {
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [categoryOption, setCategoryOption] = useState(initialCategoryOptions);
  const [selectBrandOptions, setSelectBrandOptions] = useState<SelectOption[]>(
    popularBrands.map((brand) => ({
      value: brand.toLowerCase().replace(/\s+/g, "-"),
      label: brand,
    }))
  );
  const router = useRouter();

  // useEffect(() => {
  //   const fetchCategoriesAndBrands = async () => {
  //     try {
  //       const [categoriesResponse, brandsResponse] = await Promise.all([
  //         fetch("/api/categories/get-categories"),
  //         fetch("/api/brands/get-brands"),
  //       ]);

  //       const categories = await categoriesResponse.json();
  //       const brands = await brandsResponse.json();
  //       setCategoryOption(
  //         categories.map((cat: any) => ({
  //           value: cat.id,
  //           label: cat.name,
  //         }))
  //       );
  //       setSelectBrandOptions(
  //         brands.map((brand: any) => ({
  //           value: brand.id,
  //           label: brand.name,
  //         }))
  //       );
  //     } catch (error) {
  //       toast.error("Failed to load categories and brands");
  //     }
  //   };

  //   console.log("This product is from the update form :", product);

  //   fetchCategoriesAndBrands();
  // }, []);

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
    const newBrand = {
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      label: inputValue,
    };
    setSelectBrandOptions((prev) => [...prev, newBrand]);
    return newBrand;
  };

  const checkSlugUniqueness = async (slug: string) => {
    if (product) {
      // If editing an existing product, consider the slug unique
      setIsSlugUnique(true);
      return true;
    }

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

  const initialValues: FormValues = React.useMemo(
    () => ({
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      sale_price: product?.sale_price || 0,
      sku: product?.sku || 0,
      quantity: product?.quantity || 0,
      in_stock: product?.in_stock ?? false,
      is_taxable: product?.is_taxable ?? false,
      status: product?.status || "Draft",
      product_type: product?.product_type || "Simple",
      image: product?.image || "",
      gallery: product?.gallery || [],
      categories:
        product?.categories?.map((pc) => ({
          value: pc.categoryId,
          label:
            categoryOptions.find((cat) => cat.value === pc.categoryId)?.label ||
            "",
        })) || [],
      brandId: product?.brandId || null,
      isFlashDeal: product?.isFlashDeal ?? false,
      discountPercentage: product?.discountPercentage || null,
    }),
    [product, categoryOption, selectBrandOptions]
  );
  const handleFormSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    if (!isSlugUnique && !product) {
      toast.error("Slug is not unique. Please modify the product name.");
      setSubmitting(false);
      return;
    }

    const transformedValues = {
      ...values,
      categories: values.categories.map((cat) => cat.value),
    };

    try {
      let result;
      if (product) {
        // Update existing product
        result = await updateProduct(product.id, transformedValues);
      } else {
        // Create new product
        result = await createProduct(transformedValues);
      }

      if (result.status === "success") {
        toast.success(
          product
            ? "Product updated successfully"
            : "Product created successfully"
        );
        resetForm();
        router.push(`/vendor/products/`);
      } else {
        toast.error(
          result.message ||
            (product ? "Failed to update product" : "Failed to create product")
        );
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("An error occurred while submitting the product");
    }
    setSubmitting(false);
  };

  return (
    <Card p="30px" borderRadius={8}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true} // This is important for updating initialValues when product changes
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

          const handleGalleryUpload = async (filesOrFile: File[] | File) => {
            const uploadFile = async (file: File): Promise<string> => {
              try {
                const buffer = await file.arrayBuffer();
                const key = `products/${Date.now()}_${file.name}`;
                const result = await uploadToS3(Buffer.from(buffer), key);
                return result;
              } catch (error) {
                console.error("Error uploading file:", error);
                toast.error(`Failed to upload file: ${file.name}`);
                throw error;
              }
            };

            try {
              const filesToUpload = Array.isArray(filesOrFile)
                ? filesOrFile
                : [filesOrFile];
              const uploadPromises = filesToUpload.map((file) =>
                uploadFile(file)
              );
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
                    value={product ? product.name : values.name}
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
                    value={product ? product.slug : values.slug}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    errorText={touched.slug && errors.slug}
                    disabled={!!product}
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
                  <Typography
                    as="h4"
                    fontSize="10px"
                    fontWeight="bold"
                    text-muted
                  >
                    Generate a unique SKU for the product
                  </Typography>
                  <Button
                    mt="0.5rem"
                    color="primary"
                    variant="outlined"
                    onClick={() => setFieldValue("sku", generateSKU())}
                  >
                    <LuHash />
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
                    size={15}
                    color="primary"
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
                    size={15}
                    color="primary"
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
                </Grid>

                <Grid item xs={12}>
                  <StyledLabel>Product Image</StyledLabel>
                  <StyledDropZone
                    uploadType="product-image"
                    maxSize={4 * 1024 * 1024}
                    acceptedFileTypes={{
                      "image/png": [".png"],
                      "image/jpeg": [".jpg", ".jpeg"],
                      "image/gif": [".gif"],
                      "image/webp": [".webp"],
                    }}
                    multiple={false}
                    onUpload={(url) => setFieldValue("image", url)}
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
                    uploadType="product-gallery"
                    maxSize={4 * 1024 * 1024}
                    acceptedFileTypes={{
                      "image/png": [".png"],
                      "image/jpeg": [".jpg", ".jpeg"],
                      "image/gif": [".gif"],
                      "image/webp": [".webp"],
                    }}
                    multiple={true}
                    onUpload={(url) =>
                      setFieldValue("gallery", [...values.gallery, url])
                    }
                  />
                  {values.gallery.length > 0 && (
                    <FlexBox flexDirection="row" mt={2} flexWrap="wrap">
                      {values.gallery.map((img, index) => (
                        <Image
                          key={index}
                          src={img}
                          width={100}
                          height={100}
                          m={1}
                        />
                      ))}
                    </FlexBox>
                  )}
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
                  <Select
                    isCreatable
                    options={selectBrandOptions}
                    value={
                      selectBrandOptions.find(
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
                      setFieldValue("brandId", newBrand.value);
                    }}
                    label="Brand"
                    placeholder="Select or Create Brand"
                    errorText={touched.brandId && errors.brandId}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <CheckBox
                    size={15}
                    color="primary"
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
                disabled={isSubmitting || (!product && !isSlugUnique)}
              >
                {product ? "Update Product" : "Create Product"}
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Card>
  );
}
