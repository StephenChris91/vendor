"use client";

import * as yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import { CustomerAddress } from "@prisma/client";
import { createAddress } from "actions/addresses/createAddress";
import toast from "react-hot-toast";
import { editAddress } from "actions/addresses/editAddress";

type AddressFormValues = Omit<
  CustomerAddress,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

type AddressFormProps = {
  address?: CustomerAddress;
  onSuccess?: () => void;
};

export default function AddressForm({ address, onSuccess }: AddressFormProps) {
  const router = useRouter();

  const INITIAL_VALUES: AddressFormValues = {
    title: address?.title || "",
    street: address?.street || "",
    city: address?.city || "",
    state: address?.state || "",
    country: address?.country || "",
    zipCode: address?.zipCode || "",
    phone: address?.phone || "",
    isDefault: address?.isDefault || false,
  };

  const VALIDATION_SCHEMA = yup.object().shape({
    title: yup.string().required("Title is required"),
    street: yup.string().required("Street is required"),
    city: yup.string().required("City is required"),
    state: yup.string(),
    country: yup.string().required("Country is required"),
    zipCode: yup.string(),
    phone: yup.string(),
    isDefault: yup.boolean(),
  });

  const handleFormSubmit = async (values: AddressFormValues) => {
    let result;
    if (address) {
      // If we have an existing address, update it
      result = await editAddress(address.id, values);
      if (result.success) {
        toast.success("Address updated successfully");
      }
    } else {
      // If we don't have an existing address, create a new one
      result = await createAddress(values);
      if (result.success) {
        toast.success("Address created successfully");
      }
    }

    if (result.success) {
      router.refresh();
      if (onSuccess) onSuccess();
    } else {
      console.error(result.error);
      if (!result.success) {
        toast.error("Failed to save address");
      }
      // You might want to show an error message to the user here
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={INITIAL_VALUES}
      validationSchema={VALIDATION_SCHEMA}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box mb="30px">
            <Grid container horizontal_spacing={6} vertical_spacing={4}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="title"
                  label="Address Title"
                  onBlur={handleBlur}
                  value={values.title}
                  onChange={handleChange}
                  errorText={touched.title && errors.title}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="street"
                  label="Street"
                  onBlur={handleBlur}
                  value={values.street}
                  onChange={handleChange}
                  errorText={touched.street && errors.street}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="city"
                  label="City"
                  onBlur={handleBlur}
                  value={values.city}
                  onChange={handleChange}
                  errorText={touched.city && errors.city}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="state"
                  label="State"
                  onBlur={handleBlur}
                  value={values.state}
                  onChange={handleChange}
                  errorText={touched.state && errors.state}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="country"
                  label="Country"
                  onBlur={handleBlur}
                  value={values.country}
                  onChange={handleChange}
                  errorText={touched.country && errors.country}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="zipCode"
                  label="Zip Code"
                  onBlur={handleBlur}
                  value={values.zipCode}
                  onChange={handleChange}
                  errorText={touched.zipCode && errors.zipCode}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="phone"
                  label="Phone"
                  onBlur={handleBlur}
                  value={values.phone}
                  onChange={handleChange}
                  errorText={touched.phone && errors.phone}
                />
              </Grid>

              <Grid item xs={12}>
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={values.isDefault}
                    onChange={handleChange}
                  />
                  Set as default address
                </label>
              </Grid>
            </Grid>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </Button>
        </form>
      )}
    </Formik>
  );
}
