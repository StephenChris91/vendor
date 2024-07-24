// app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";

import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";
import { H3, H5, Small } from "@component/Typography";
import { adminLogin } from "actions/adminLogin";

export default function AdminLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = { email: "", password: "" };

  const formSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const handleFormSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const result = await adminLogin(values);
      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.success);
        router.push("/admin");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: handleFormSubmit,
      validationSchema: formSchema,
    });

  return (
    <FlexBox
      justifyContent="center"
      alignItems="center"
      height="100vh"
      backgroundColor="gray.100"
    >
      <Box
        width="400px"
        padding="2rem"
        backgroundColor="white"
        borderRadius="8px"
        // boxShadow="large"
      >
        <form onSubmit={handleSubmit}>
          <H3 textAlign="center" mb="0.5rem">
            Admin Login
          </H3>

          <H5
            fontWeight="600"
            fontSize="12px"
            color="gray.800"
            textAlign="center"
            mb="2.25rem"
          >
            Log in with your admin credentials
          </H5>

          <TextField
            fullwidth
            mb="0.75rem"
            name="email"
            type="email"
            onBlur={handleBlur}
            value={values.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            label="Email"
            errorText={touched.email && errors.email}
          />

          <TextField
            mb="1rem"
            fullwidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="*********"
            value={values.password}
            errorText={touched.password && errors.password}
          />

          <Button
            mb="1.65rem"
            variant="contained"
            color="primary"
            type="submit"
            fullwidth
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>

          {isLoading && (
            <Box textAlign="center">
              <Small>Verifying credentials...</Small>
            </Box>
          )}
        </form>
      </Box>
    </FlexBox>
  );
}
