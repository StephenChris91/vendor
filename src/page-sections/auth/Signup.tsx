"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";

import useVisibility from "./useVisibility";

import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button, IconButton } from "@component/buttons";
import { H3, H5, H6, SemiSpan, Small, Span } from "@component/Typography";
import { StyledRoot } from "./styles";
import { register } from "actions/register"; // Assuming you have a register action
import { userRole } from "@prisma/client";
import CheckBox from "@component/CheckBox";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Register() {
  const { passwordVisibility, togglePasswordVisibility } = useVisibility();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const initialValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    isVendor: false,
    role: "Customer" as userRole, // Default role
  };

  const formSchema = yup.object().shape({
    firstname: yup.string().required("First name is required"),
    lastname: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    isVendor: yup.boolean(),
    role: yup
      .string()
      .oneOf(["Customer", "Vendor", "Admin"], "Invalid role")
      .default("Customer")
      .required("Role is required"),
  });

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form with values:", values);
      const result = await register(values);
      console.log("Registration result:", result);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);

        router.push("/login");
      } else {
        console.error("Unexpected result structure:", result);
        setError("An unexpected error occurred");
      }
    } catch (error) {
      console.error("Caught error during registration:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: handleFormSubmit,
    validationSchema: formSchema,
  });

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <form className="content" onSubmit={handleSubmit}>
        <H3 textAlign="center" mb="0.5rem">
          Create Your Account
        </H3>

        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Please fill all fields to continue
        </H5>

        <TextField
          fullwidth
          mb="0.75rem"
          name="firstname"
          label="First Name"
          onBlur={handleBlur}
          value={values.firstname}
          onChange={handleChange}
          errorText={touched.firstname && errors.firstname}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="lastname"
          label="Last Name"
          onBlur={handleBlur}
          value={values.lastname}
          onChange={handleChange}
          errorText={touched.lastname && errors.lastname}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="email"
          type="email"
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          label="Email"
          errorText={touched.email && errors.email}
        />

        <TextField
          mb="0.75rem"
          fullwidth
          name="password"
          label="Password"
          autoComplete="new-password"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="*********"
          value={values.password}
          errorText={touched.password && errors.password}
          type={passwordVisibility ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <IconButton
                p="0.25rem"
                mr="0.25rem"
                type="button"
                onClick={togglePasswordVisibility}
                color={passwordVisibility ? "gray.700" : "gray.600"}
              >
                <Icon variant="small" defaultcolor="currentColor">
                  {passwordVisibility ? "eye-alt" : "eye"}
                </Icon>
              </IconButton>
            ),
          }}
        />

        <TextField
          mb="0.75rem"
          fullwidth
          name="confirmPassword"
          label="Confirm Password"
          autoComplete="new-password"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="*********"
          value={values.confirmPassword}
          errorText={touched.confirmPassword && errors.confirmPassword}
          type={passwordVisibility ? "text" : "password"}
        />

        <Box mb="0.75rem">
          <FlexBox alignItems="flex-start">
            <CheckBox
              size={12}
              name="isVendor"
              color="primary"
              checked={values.isVendor}
              onChange={(e) => {
                console.log("Checkbox checked:", values.isVendor); // Add this line for debugging
                const isVendor = e.target.checked;
                setFieldValue("isVendor", isVendor);
                setFieldValue("role", isVendor ? "Vendor" : "Customer");
              }}
              onBlur={handleBlur}
              label={
                <Box>
                  <H6 mb="0.25rem">Are you a seller?</H6>
                  <Small color="gray.600">
                    By selecting this option, you agree to become a seller on
                    Vendorspot
                  </Small>
                </Box>
              }
            />
          </FlexBox>
          {touched.role && errors.role && (
            <Small color="error.main" mt="0.5rem">
              {errors.role}
            </Small>
          )}
        </Box>

        <Button
          mb="1.65rem"
          variant="contained"
          color="primary"
          type="submit"
          fullwidth
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>

        {error && (
          <Box mb="1rem" color="error.main">
            <Small>{error}</Small>
          </Box>
        )}

        <FlexBox justifyContent="center" mb="1.25rem">
          <SemiSpan>Already have an account?</SemiSpan>
          <Link href="/login">
            <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
              Login
            </H6>
          </Link>
        </FlexBox>
      </form>
    </StyledRoot>
  );
}
