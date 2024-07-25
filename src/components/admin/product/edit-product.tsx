import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Box from "@component/Box";
import { useProduct, useUpdateProduct } from "@hook/useProducts";
import Select, { SelectOption } from "@component/Select";
import Checkbox from "@component/CheckBox";
import { H6, Small } from "@component/Typography";
import FlexBox from "@component/FlexBox";
import DropZone from "@component/DropZone";

import toast from "react-hot-toast";
import { useCategories } from "@hook/useCategories";
import { useUploadImage } from "@hook/useImageUpload";

interface EditProductProps {
  productId: string;
  onClose: () => void;
  userName: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number;
  sku: number;
  quantity: number;
  in_stock: boolean;
  is_taxable: boolean;
  status: "Published" | "Draft" | "Suspended" | "OutOfStock";
  product_type: "Simple" | "Variable";
  video?: string;
  image?: string;
  gallery?: string[];
  categories: string[]; // Change this to string[] to store category IDs
}

interface ProductFormValues extends Omit<Product, "categories"> {
  categories: string[];
  mainImageFile?: File | null;
  galleryFiles?: File[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  slug: Yup.string().required("Slug is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  sale_price: Yup.number()
    .positive("Sale price must be positive")
    .lessThan(Yup.ref("price"), "Sale price must be less than regular price"),
  sku: Yup.number()
    .positive("SKU must be positive")
    .required("SKU is required"),
  quantity: Yup.number()
    .integer("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .required("Quantity is required"),
  status: Yup.string()
    .oneOf(["Published", "Draft", "Suspended", "OutOfStock"], "Invalid status")
    .required("Status is required"),
  product_type: Yup.string()
    .oneOf(["Simple", "Variable"], "Invalid product type")
    .required("Product type is required"),
  categories: Yup.array()
    .of(Yup.string())
    .min(1, "At least one category is required"),
});

const EditProduct: React.FC<EditProductProps> = ({
  productId,
  onClose,
  userName,
}) => {
  const {
    data: product,
    isLoading: productLoading,
    isError: productError,
  } = useProduct(productId);
  const updateProductMutation = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { uploadImage, uploadMultipleImages, isUploading } =
    useUploadImage(userName);

  if (productLoading || categoriesLoading) return <div>Loading...</div>;
  if (productError) {
    toast.error("Error loading product");
    return null;
  }
  if (!product) return null;

  const initialValues: ProductFormValues = {
    ...product,
    categories: product.categories,
    mainImageFile: null,
    galleryFiles: [],
  };

  const handleSubmit = async (values: ProductFormValues, { setSubmitting }) => {
    const toastId = toast.loading("Updating product...");
    try {
      let updatedValues: Partial<Product> = { ...values };

      if (values.mainImageFile) {
        const imageUrl = await uploadImage(values.mainImageFile);
        updatedValues.image = imageUrl;
      }

      if (values.galleryFiles && values.galleryFiles.length > 0) {
        const galleryUrls = await uploadMultipleImages(values.galleryFiles);
        updatedValues.gallery = [
          ...(updatedValues.gallery || []),
          ...galleryUrls,
        ];
      }

      // Remove temporary fields
      delete updatedValues.mainImageFile;
      delete updatedValues.galleryFiles;

      await updateProductMutation.mutateAsync(updatedValues);
      toast.success("Product updated successfully", { id: toastId });
      onClose();
    } catch (error) {
      toast.error("Failed to update product", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            {/* Form fields remain the same */}
            {/* ... */}

            {/* Categories */}
            <H6 mb={2} mt={4}>
              Categories
            </H6>
            <Field
              name="categories"
              as={Select}
              label="Categories"
              options={
                categories?.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })) || []
              }
              isMulti
              mb={2}
              error={touched.categories && errors.categories}
            />

            <FlexBox justifyContent="flex-end" mt={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || isUploading}
                mr={2}
              >
                {isSubmitting || isUploading ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={onClose} variant="outlined" color="secondary">
                Cancel
              </Button>
            </FlexBox>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default EditProduct;
