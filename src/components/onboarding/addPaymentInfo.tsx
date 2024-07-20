"use client";

import { useFormik } from "formik";
import * as yup from "yup";

import { StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import { H3, H5, Small } from "@component/Typography";
import TextField from "@component/text-field";

const AddPaymentInfo = ({ updateFormData, paymentInfo }) => {
  const formSchema = yup.object().shape({
    accountName: yup.string().required("Account name is required"),
    accountNo: yup
      .string()
      .matches(/^\d+$/, "Account number must contain only digits")
      .min(0, "Account number must be at least 0 digits")
      .max(11, "Account number must not exceed 11 digits")
      .required("Account number is required"),
    bankName: yup.string().required("Bank name is required"),
  });

  const formik = useFormik({
    initialValues: {
      accountName: paymentInfo?.accountName || "",
      accountNumber: paymentInfo?.accountNumber || "",
      bankName: paymentInfo?.bankName || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({ paymentInfo: values });
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

  return (
    <StyledRoot mx="auto" my="2rem" boxShadow="large" borderRadius={8}>
      <Box className="content">
        <H3 textAlign="center" mb="0.5rem">
          Payment Information
        </H3>

        <H5
          fontWeight="600"
          fontSize="12px"
          color="gray.800"
          textAlign="center"
          mb="2.25rem"
        >
          Please provide your bank account details
        </H5>

        <TextField
          fullwidth
          mb="0.75rem"
          name="accountName"
          label="Account Name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={formik.values.accountName}
          errorText={formik.touched.accountName && formik.errors.accountName}
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="accountNumber"
          label="Account Number"
          onBlur={handleBlur}
          onChange={handleChange}
          value={formik.values.accountNumber}
          errorText={
            formik.touched.accountNumber && formik.errors.accountNumber
          }
        />

        <TextField
          fullwidth
          mb="0.75rem"
          name="bankName"
          label="Bank Name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={formik.values.bankName}
          errorText={formik.touched.bankName && formik.errors.bankName}
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

export default AddPaymentInfo;
