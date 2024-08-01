"use client";

import * as yup from "yup";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import { editPaymentMethod } from "actions/payments/editPaymentMethod";
import { createPaymentMethod } from "actions/payments/createPaymentMethod";
import toast from "react-hot-toast";

type MethodEditFormProps = {
  paymentMethod?: {
    id: string;
    cardNumber: string;
    cardHolderName: string;
    expirationDate: string;
    cvc: string;
  };
};

export default function MethodEditForm({ paymentMethod }: MethodEditFormProps) {
  const router = useRouter();

  const INITIAL_VALUES = {
    cardNumber: paymentMethod?.cardNumber || "",
    cardHolderName: paymentMethod?.cardHolderName || "",
    expirationDate: paymentMethod?.expirationDate || "",
    cvc: paymentMethod?.cvc || "",
  };

  const VALIDATION_SCHEMA = yup.object().shape({
    cardNumber: yup.string().required("required"),
    cardHolderName: yup.string().required("required"),
    expirationDate: yup.string().required("required"),
    cvc: yup.string().required("required"),
  });

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    let result;
    if (paymentMethod) {
      result = await editPaymentMethod(paymentMethod.id, values);
    } else {
      result = await createPaymentMethod(values);
    }

    if (result.success) {
      router.push("/payment-methods");
      toast.success("Payment Method saved successfully");
      router.refresh();
    } else {
      console.error(result.error);
      // Show error message to user
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
      }) => (
        <form onSubmit={handleSubmit}>
          <Box mb="30px">
            <Grid container horizontal_spacing={6} vertical_spacing={4}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="cardNumber"
                  label="Card Number"
                  onBlur={handleBlur}
                  value={values.cardNumber}
                  onChange={handleChange}
                  errorText={touched.cardNumber && errors.cardNumber}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="cardHolderName"
                  onBlur={handleBlur}
                  value={values.cardHolderName}
                  label="Name on Card"
                  onChange={handleChange}
                  errorText={touched.cardHolderName && errors.cardHolderName}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="expirationDate"
                  label="Exp. Date"
                  value={values.expirationDate}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  errorText={touched.expirationDate && errors.expirationDate}
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <TextField
                  fullwidth
                  name="cvc"
                  label="CVC"
                  value={values.cvc}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  errorText={touched.cvc && errors.cvc}
                />
              </Grid>
            </Grid>
          </Box>

          <Button type="submit" variant="contained" color="primary">
            {paymentMethod ? "Save Changes" : "Add Payment Method"}
          </Button>
        </form>
      )}
    </Formik>
  );
}
