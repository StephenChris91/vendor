"use client";

import React, { useState, useEffect } from "react";
import { PaystackConsumer } from "react-paystack";
import toast from "react-hot-toast";
import { Button } from "@component/buttons";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";

interface ProcessPaymentProps {
  setPaymentProcessed: (status: boolean) => void;
  userEmail: string;
  userId: string;
  formData: any; // Replace 'any' with your actual form data type
  onNextStep: () => void;
  setStepValidation: (isValid: boolean) => void;
}

const ProcessPayment: React.FC<ProcessPaymentProps> = ({
  setPaymentProcessed,
  userEmail,
  userId,
  formData,
  onNextStep,
  setStepValidation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);

  useEffect(() => {
    // Initially, the step is not valid because payment hasn't been made
    setStepValidation(false);
  }, []);

  const handleSuccess = () => {
    setIsLoading(true);
    // Here you would typically verify the payment on your server
    // For now, we'll just simulate a successful verification
    setTimeout(() => {
      setPaymentProcessed(true);
      setIsPaymentCompleted(true);
      setStepValidation(true);
      toast.success("Payment successful!");
      onNextStep();
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    toast.error("Payment cancelled. Please try again.");
    setIsLoading(false);
    setStepValidation(false);
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
        Complete your payment to finalize shop creation
      </H5>

      <Small color="text.secondary" mb="1rem" display="block">
        You will be prompted to complete your payment of 2000 Naira via
        Paystack.
      </Small>

      {!isPaymentCompleted ? (
        <PaystackConsumer
          reference={`REF-${userId}-${Date.now()}`}
          email={userEmail}
          amount={100000} // 2000 Naira in kobo
          publicKey={process.env.NEXT_PUBLIC_PAYSTACK_LIVE_KEY!}
          onSuccess={handleSuccess}
          onClose={handleClose}
        >
          {({ initializePayment }) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => initializePayment()}
              disabled={isLoading}
              fullwidth
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </Button>
          )}
        </PaystackConsumer>
      ) : (
        <Small color="success.main" mt="1rem" display="block">
          Payment completed successfully. You can now proceed to the next step.
        </Small>
      )}

      <Small color="text.secondary" mt="1rem" display="block">
        By clicking "Proceed to Payment", you agree to our terms of service.
      </Small>
    </Box>
  );
};

export default ProcessPayment;
