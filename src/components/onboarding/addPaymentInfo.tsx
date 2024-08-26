import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import TextField from "@component/text-field";

interface PaymentInfo {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

interface AddPaymentInfoProps {
  updateFormData: (data: { paymentInfo: PaymentInfo }) => void;
  initialPaymentInfo: PaymentInfo;
  setStepValidation: (isValid: boolean) => void;
}

const formSchema = yup.object().shape({
  accountName: yup.string().required("Account name is required"),
  accountNumber: yup
    .string()
    .matches(/^\d{10,11}$/, "Account number must be 10 or 11 digits")
    .required("Account number is required"),
  bankName: yup.string().required("Bank name is required"),
});

const AddPaymentInfo: React.FC<AddPaymentInfoProps> = ({
  updateFormData,
  initialPaymentInfo,
  setStepValidation,
}) => {
  const formik = useFormik<PaymentInfo>({
    initialValues: {
      accountName: initialPaymentInfo?.accountName || "",
      accountNumber: initialPaymentInfo?.accountNumber || "",
      bankName: initialPaymentInfo?.bankName || "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      updateFormData({ paymentInfo: values });
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
    if (initialPaymentInfo) {
      formik.setValues(initialPaymentInfo);
    }
  }, [initialPaymentInfo]);

  useEffect(() => {
    formik.validateForm();
  }, []);

  const handleBlur = (e: React.FocusEvent<any>) => {
    formik.handleBlur(e);
    formik.submitForm();
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    if (name === "accountNumber") {
      // Only allow digits and limit to 11 characters
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 11);
      formik.setFieldValue(name, sanitizedValue);
    } else {
      formik.handleChange(e);
    }
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
        errorText={formik.touched.accountNumber && formik.errors.accountNumber}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
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
  );
};

export default AddPaymentInfo;
