"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import { StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import { H3, H5, Small } from "@component/Typography";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";

// You'll need to implement this function to reverse geocode coordinates
import { reverseGeocode } from "lib/geocode";

const AddShopAddress = ({ updateFormData, address }) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const formSchema = yup.object().shape({
    street: yup.string().required("Street address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    postalCode: yup.string().required("Postal code is required"),
    country: yup.string().required("Country is required"),
  });

  const formik = useFormik({
    initialValues: {
      street: address?.street || "",
      city: address?.city || "",
      state: address?.state || "",
      postalCode: address?.postalCode || "",
      country: address?.country || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({ address: values });
    },
  });

  const handleBlur = (e) => {
    formik.handleBlur(e);
    formik.submitForm();
  };

  const handleChange = (e) => {
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
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <Box className="content">
        <H3 textAlign="center" mb="0.5rem">
          Shop Address
        </H3>

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
    </StyledRoot>
  );
};

export default AddShopAddress;
