"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import toast from "react-hot-toast";
import { Button } from "@component/buttons";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";

interface ProcessPaymentProps {
  setPaymentProcessed: (status: boolean) => void;
  userEmail: string;
  userId: string;
  updatePaymentStatus: (
    userId: string
  ) => Promise<{ success: boolean; message: string; user?: any }>;
  onNextStep: () => void;
  setStepValidation: (isValid: boolean) => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const ProcessPayment: React.FC<ProcessPaymentProps> = ({
  setPaymentProcessed,
  userEmail,
  userId,
  updatePaymentStatus,
  onNextStep,
  setStepValidation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    setStepValidation(false);
  }, []);

  const handlePayment = () => {
    if (!isScriptLoaded) {
      toast.error("Payment system is not ready. Please try again in a moment.");
      return;
    }

    setIsLoading(true);

    const handler = window.PaystackPop.setup({
      key:
        process.env.NODE_ENV !== "production"
          ? process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!
          : process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!,
      email: userEmail,
      amount: 200000, // 2000 Naira in kobo
      ref: `REF-${userId}-${Date.now()}`,
      onClose: function () {
        setIsLoading(false);
        toast.error("Payment cancelled. Please try again.");
      },
      callback: function (response: any) {
        handlePaymentCallback(response);
      },
    });

    handler.openIframe();
  };

  const handlePaymentCallback = async (response: any) => {
    try {
      const result = await updatePaymentStatus(userId);
      if (result.success) {
        setPaymentProcessed(true);
        setStepValidation(true);
        toast.success("Payment successful!");
        onNextStep();
      } else {
        throw new Error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "There was an issue processing your payment. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="content" width="auto" height="auto" paddingBottom={6}>
      <Script
        src="https://js.paystack.co/v1/inline.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
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

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={isLoading || !isScriptLoaded}
        fullwidth
      >
        {isLoading
          ? "Processing..."
          : isScriptLoaded
          ? "Proceed to Payment"
          : "Loading Payment System..."}
      </Button>

      <Small color="text.secondary" mt="1rem" display="block">
        By clicking "Proceed to Payment", you agree to our terms of service.
      </Small>
    </Box>
  );
};

export default ProcessPayment;
