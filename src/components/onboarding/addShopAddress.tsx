"use client";

import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";

import { reverseGeocode } from "lib/geocode";

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddShopAddressProps {
  updateFormData: (data: { address: Address }) => void;
  initialAddress: Address;
  userName: string;
  userEmail: string;
  userId: string;
  setStepValidation: (isValid: boolean) => void;
}

const formSchema = yup.object().shape({
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup.string().required("Postal code is required"),
  country: yup.string().required("Country is required"),
});

const AddShopAddress: React.FC<AddShopAddressProps> = ({
  updateFormData,
  initialAddress,
  userName,
  userEmail,
  userId,
  setStepValidation,
}) => {
  const [isDetectingLocation, setIsDetectingLocation] = React.useState(false);

  const formik = useFormik({
    initialValues: initialAddress || {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({ address: values });
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
    if (initialAddress) {
      formik.setValues(initialAddress);
    }
  }, [initialAddress]);

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

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const addressDetails = await reverseGeocode(latitude, longitude);

            formik.setValues({
              street: addressDetails.street,
              city: addressDetails.city,
              state: addressDetails.state,
              postalCode: addressDetails.postalCode,
              country: addressDetails.country,
            });
            formik.submitForm();
            toast.success("Location detected successfully!");
          } catch (error) {
            console.error("Error detecting location:", error);
            toast.error("Failed to detect location. Please enter manually.");
          } finally {
            setIsDetectingLocation(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to detect location. Please enter manually.");
          setIsDetectingLocation(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
      setIsDetectingLocation(false);
    }
  };

  return (
    <Box
      className="content"
      width="auto"
      height="auto"
      paddingBottom={6}
      padding={9}
    >
      <H5
        fontWeight="600"
        fontSize="12px"
        color="gray.800"
        textAlign="center"
        mb="2.25rem"
      >
        Please provide your shop's address
      </H5>

      <Button
        mb="1rem"
        variant="outlined"
        color="primary"
        onClick={detectLocation}
        disabled={isDetectingLocation}
      >
        {isDetectingLocation ? "Detecting Location..." : "Detect My Location"}
      </Button>

      <TextField
        fullwidth
        mb="0.75rem"
        name="street"
        label="Street Address"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.street}
        errorText={formik.touched.street && formik.errors.street}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="city"
        label="City"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.city}
        errorText={formik.touched.city && formik.errors.city}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="state"
        label="State"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.state}
        errorText={formik.touched.state && formik.errors.state}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="postalCode"
        label="Postal Code"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.postalCode}
        errorText={formik.touched.postalCode && formik.errors.postalCode}
      />

      <TextField
        fullwidth
        mb="0.75rem"
        name="country"
        label="Country"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.country}
        errorText={formik.touched.country && formik.errors.country}
      />

      {Object.keys(formik.errors).length > 0 && (
        <Small color="error.main" mt="0.5rem">
          Please fill all fields correctly before proceeding.
        </Small>
      )}
    </Box>
  );
};

export default AddShopAddress;
