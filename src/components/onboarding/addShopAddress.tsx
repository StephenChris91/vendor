"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import toast from "react-hot-toast";

import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import TextField from "@component/text-field";
import Select, { SelectOption } from "@component/Select";
import { Button } from "@component/buttons";

import { reverseGeocode } from "lib/geocode";
import { fetchCities } from "@lib/fetchTerminalCities";

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
}

interface FormData {
  address: Address;
}

interface AddShopAddressProps {
  updateFormData: (data: Partial<FormData>) => void;
  initialAddress: Address;
  userName: string;
  userEmail: string;
  userId: string;
  setStepValidation: (isValid: boolean) => void;
}

const formSchema = yup.object().shape({
  street: yup.string().required("Street address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup.string().required("Postal code is required"),
  country: yup.string().required("Country code is required"),
  state: yup.string().required("State code is required"),
});

const nigerianStates: SelectOption[] = [
  { value: "Abia", label: "Abia (AB)" },
  { value: "Adamawa", label: "Adamawa (AD)" },
  { value: "Akwa Ibom", label: "Akwa Ibom (AK)" },
  { value: "Anambra", label: "Anambra (AN)" },
  { value: "Bauchi", label: "Bauchi (BA)" },
  { value: "Bayelsa", label: "Bayelsa (BY)" },
  { value: "Benue", label: "Benue (BE)" },
  { value: "Borno", label: "Borno (BO)" },
  { value: "Cross River", label: "Cross River (CR)" },
  { value: "Delta", label: "Delta (DE)" },
  { value: "Ebonyi", label: "Ebonyi (EB)" },
  { value: "Edo", label: "Edo (ED)" },
  { value: "Ekiti", label: "Ekiti (EK)" },
  { value: "Enugu", label: "Enugu (EN)" },
  { value: "Abuja", label: "Abuja (FCT)" },
  { value: "Gombe", label: "Gombe (GO)" },
  { value: "Imo", label: "Imo (IM)" },
  { value: "Jigawa", label: "Jigawa (JI)" },
  { value: "Kaduna", label: "Kaduna (KD)" },
  { value: "Kano", label: "Kano (KN)" },
  { value: "Katsina", label: "Katsina (KT)" },
  { value: "Kebbi", label: "Kebbi (KE)" },
  { value: "Kebbi", label: "Kogi (KO)" },
  { value: "Kwara", label: "Kwara (KW)" },
  { value: "Kwara", label: "Lagos (LA)" },
  { value: "Nasarawa", label: "Nasarawa (NA)" },
  { value: "Niger", label: "Niger (NI)" },
  { value: "Ogun", label: "Ogun (OG)" },
  { value: "Ondo", label: "Ondo (ON)" },
  { value: "Osun", label: "Osun (OS)" },
  { value: "Oyo", label: "Oyo (OY)" },
  { value: "Plateau", label: "Plateau (PL)" },
  { value: "RI", label: "Rivers (RI)" },
  { value: "Rivers", label: "Sokoto (SO)" },
  { value: "Taraba", label: "Taraba (TA)" },
  { value: "Yobe", label: "Yobe (YO)" },
  { value: "Zamfara", label: "Zamfara (ZA)" },
];

const AddShopAddress: React.FC<AddShopAddressProps> = ({
  updateFormData,
  initialAddress,
  userName,
  userEmail,
  userId,
  setStepValidation,
}) => {
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [cities, setCities] = useState<SelectOption[]>([]);

  const formik = useFormik({
    initialValues: {
      ...initialAddress,
      country: "NG",
      state: "",
      cityOption: null as SelectOption | null,
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({
        address: {
          street: values.street,
          city: values.cityOption ? values.cityOption.value : "",
          postalCode: values.postalCode,
          country: values.country,
          state: values.state,
        },
      });
    },
    validate: (values) => {
      try {
        formSchema.validateSync(values, { abortEarly: false });
        return {};
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          err.inner.forEach((error) => {
            if (error.path) {
              errors[error.path] = error.message;
            }
          });
          return errors;
        }
        return {};
      }
    },
  });

  useEffect(() => {
    const isValid = Object.keys(formik.errors).length === 0 && formik.dirty;
    setStepValidation(isValid);
  }, [formik.errors, formik.dirty, setStepValidation]);

  useEffect(() => {
    if (formik.values.country && formik.values.state) {
      fetchCities(formik.values.country, formik.values.state)
        .then((fetchedCities) => {
          const cityOptions = fetchedCities.map((city) => ({
            value: city.name,
            label: city.name,
          }));
          setCities(cityOptions);
        })
        .catch((error) => {
          toast.error("Failed to fetch cities. Please try again.");
        });
    }
  }, [formik.values.country, formik.values.state]);

  const handleBlur = (e: React.FocusEvent<any>) => {
    formik.handleBlur(e);
    formik.submitForm();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    formik.handleChange(e);
    formik.submitForm();
  };

  const handleCityChange = (option: SelectOption | SelectOption[] | null) => {
    if (Array.isArray(option)) {
      console.warn("Multi-select is not supported for city selection");
      return;
    }
    formik.setFieldValue("cityOption", option);
    formik.setFieldValue("city", option ? option.value : "");
    formik.submitForm();
  };

  const handleStateChange = (option: SelectOption | null) => {
    if (option) {
      formik.setFieldValue("state", option.value);
      formik.submitForm();
    }
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
              ...formik.values,
              street: addressDetails.street,
              cityOption: {
                value: addressDetails.city,
                label: addressDetails.city,
              },
              state: addressDetails.state,
              postalCode: addressDetails.postalCode,
              country: addressDetails.country || "NG",
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

      {/* <Button
        mb="1rem"
        variant="outlined"
        color="primary"
        onClick={detectLocation}
        disabled={isDetectingLocation}
      >
        {isDetectingLocation ? "Detecting Location..." : "Detect My Location"}
      </Button> */}

      <TextField
        fullwidth
        mb="0.75rem"
        name="country"
        label="Country Code"
        value={formik.values.country}
        disabled
      />

      <Select
        options={nigerianStates}
        mb="0.75rem"
        name="state"
        label="State"
        value={nigerianStates.find(
          (state) => state.value === formik.values.state
        )}
        onChange={handleStateChange}
        errorText={formik.touched.state && formik.errors.state}
      />

      <Select
        options={cities}
        mb="0.75rem"
        name="cityOption"
        label="City"
        value={formik.values.cityOption}
        onChange={handleCityChange}
        errorText={formik.touched.city && formik.errors.city}
      />

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
        name="postalCode"
        label="Postal Code"
        onBlur={handleBlur}
        onChange={handleChange}
        value={formik.values.postalCode}
        errorText={formik.touched.postalCode && formik.errors.postalCode}
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
