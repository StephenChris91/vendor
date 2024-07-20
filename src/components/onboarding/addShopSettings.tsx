"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import TextField from "@component/text-field";
import Select from "@component/Select";
import CheckBox from "@component/CheckBox";

interface AddShopSettingsProps {
  updateFormData: (data: { shopSettings: ShopSettings }) => void;
  initialShopSettings: ShopSettings;
}

interface ShopSettings {
  phoneNumber: string;
  website: string;
  businessHours: string;
  category: string;
  deliveryOptions: string[];
  isActive: boolean;
}

interface CategoryOption {
  value: string;
  label: string;
}

const formSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^[0-9+\-() ]+$/, "Invalid phone number")
    .required("Phone number is required"),
  website: yup.string().url("Invalid URL").nullable(),
  businessHours: yup.string().required("Business hours are required"),
  category: yup.string().required("Shop category is required"),
  deliveryOptions: yup
    .array()
    .of(yup.string())
    .min(1, "Select at least one delivery option"),
  isActive: yup.boolean(),
});

const categoryOptions: CategoryOption[] = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "food", label: "Food & Beverages" },
  { value: "home", label: "Home & Garden" },
  { value: "beauty", label: "Beauty & Health" },
  { value: "other", label: "Other" },
];

const deliveryOptions = [
  { value: "pickup", label: "In-store Pickup" },
  { value: "local", label: "Local Delivery" },
  { value: "shipping", label: "Shipping" },
];

const AddShopSettings: React.FC<AddShopSettingsProps> = ({
  updateFormData,
  initialShopSettings,
}) => {
  const formik = useFormik({
    initialValues: {
      phoneNumber: initialShopSettings?.phoneNumber || "",
      website: initialShopSettings?.website || "",
      businessHours: initialShopSettings?.businessHours || "",
      category: initialShopSettings?.category || "",
      deliveryOptions: initialShopSettings?.deliveryOptions || [],
      isActive: initialShopSettings?.isActive ?? true,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({ shopSettings: values });
    },
  });

  useEffect(() => {
    if (initialShopSettings) {
      formik.setValues(initialShopSettings);
    }
  }, [initialShopSettings]);

  const handleBlur = (e: React.FocusEvent<any>) => {
    formik.handleBlur(e);
    formik.submitForm();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    formik.handleChange(e);
    formik.submitForm();
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
        Configure your shop settings
      </H5>

      <TextField
        fullwidth
        mb="0.75rem"
        name="phoneNumber"
        label="Phone Number"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.phoneNumber}
        errorText={formik.touched.phoneNumber && formik.errors.phoneNumber}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="website"
        label="Website (optional)"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.website}
        errorText={formik.touched.website && formik.errors.website}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="businessHours"
        label="Business Hours"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.businessHours}
        errorText={formik.touched.businessHours && formik.errors.businessHours}
        placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-3PM"
      />

      <Select
        options={categoryOptions}
        value={categoryOptions.find(
          (option) => option.value === formik.values.category
        )}
        onChange={(selectedOption: CategoryOption | null) => {
          if (selectedOption) {
            formik.setFieldValue("category", selectedOption.value);
            formik.submitForm();
          }
        }}
        label="Shop Category"
        errorText={formik.touched.category && formik.errors.category}
      />

      <Box mb="0.75rem">
        <H5 mb="0.5rem">Delivery Options</H5>
        {deliveryOptions.map((option) => (
          <CheckBox
            key={option.value}
            name="deliveryOptions"
            label={option.label}
            checked={formik.values.deliveryOptions.includes(option.value)}
            onChange={() => {
              const updatedOptions = formik.values.deliveryOptions.includes(
                option.value
              )
                ? formik.values.deliveryOptions.filter(
                    (val) => val !== option.value
                  )
                : [...formik.values.deliveryOptions, option.value];
              formik.setFieldValue("deliveryOptions", updatedOptions);
              formik.submitForm();
            }}
          />
        ))}
        {formik.touched.deliveryOptions && formik.errors.deliveryOptions && (
          <Small color="error.main">{formik.errors.deliveryOptions}</Small>
        )}
      </Box>

      <CheckBox
        name="isActive"
        label="Shop is active and ready for business"
        checked={formik.values.isActive}
        onChange={() => {
          formik.setFieldValue("isActive", !formik.values.isActive);
          formik.submitForm();
        }}
      />

      {Object.keys(formik.errors).length > 0 && (
        <Small color="error.main" mt="0.5rem">
          Please fill all fields correctly before proceeding.
        </Small>
      )}
    </Box>
  );
};

export default AddShopSettings;
