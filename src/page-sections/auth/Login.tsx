"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import useVisibility from "./useVisibility";
import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button, IconButton } from "@component/buttons";
import { H3, H5, H6, SemiSpan, Small, Span } from "@component/Typography";
import { StyledRoot } from "./styles";
import { login } from "actions/login";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useAuth } from "@context/authContext";

type LoginProps = {
  onLoginSuccess?: () => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const router = useRouter();
  const { passwordVisibility, togglePasswordVisibility } = useVisibility();
  const [isLoading, setIsLoading] = useState(false);
  const { refreshAuth } = useAuth();

  const initialValues = { email: "", password: "" };

  const formSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("${path} is required"),
    password: yup.string().required("${path} is required"),
  });

  const handleFormSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      const result = await login(values); // Calls the server-side login function

      if (result.error) {
        // Handle specific errors and show appropriate messages
        if (result.error === "Invalid email or password") {
          toast.error(
            "The email or password you entered is incorrect. Please try again."
          );
        } else if (result.error === "This user does not exist!") {
          toast.error("The account with this email does not exist.");
        } else if (result.success === "Confirmation email sent") {
          toast.success(
            "A confirmation email has been sent to your inbox. Please verify your email to proceed."
          );
        } else {
          toast.error(result.error);
        }
      } else if (result.success) {
        // Use the signIn function from next-auth/react on the client side
        const signInResult = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error(signInResult.error);
        } else {
          toast.success(result.success);
          refreshAuth(); // Refresh the auth context
          if (onLoginSuccess) {
            onLoginSuccess();
          }
          // Handle client-side navigation based on user role
          if (result.redirectTo) {
            router.push(result.redirectTo);
          }
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
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
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <form className="content" onSubmit={handleSubmit}>
        <H3 textAlign="center" mb="0.5rem">
          Welcome To Vendorspot
        </H3>

        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Log in with email & password
        </H5>

        <TextField
          fullwidth
          mb="0.75rem"
          name="email"
          type="email"
          onBlur={handleBlur}
          value={values.email}
          onChange={handleChange}
          placeholder="example@mail.com"
          label="Email or Phone Number"
          errorText={touched.email && errors.email}
        />

        <TextField
          mb="1rem"
          fullwidth
          name="password"
          label="Password"
          autoComplete="on"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="*********"
          value={values.password}
          errorText={touched.password && errors.password}
          type={passwordVisibility ? "text" : "password"}
          endAdornment={
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
          }
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

        <Box mb="1rem">
          <Divider width="200px" mx="auto" />
          <FlexBox justifyContent="center" mt="-14px">
            <Span color="text.muted" bg="body.paper" px="1rem">
              on
            </Span>
          </FlexBox>
        </Box>

        <FlexBox justifyContent="center" mb="1.25rem">
          <SemiSpan>Don't have account?</SemiSpan>
          <Link href="/signup">
            <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
              Sign Up
            </H6>
          </Link>
        </FlexBox>
      </form>

      <FlexBox justifyContent="center" bg="gray.200" py="19px">
        <SemiSpan>Forgot your password?</SemiSpan>
        <Link href="/">
          <H6 ml="0.5rem" borderBottom="1px solid" borderColor="gray.900">
            Reset It
          </H6>
        </Link>
      </FlexBox>
    </StyledRoot>
  );
}
