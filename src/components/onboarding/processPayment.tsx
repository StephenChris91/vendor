"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { initializePayment, verifyPayment } from "actions/payment";
import { Button } from "@component/buttons";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";

interface ProcessPaymentProps {
  setPaymentProcessed: (status: boolean) => void;
  userEmail: string;
  userId: string;
}

const ProcessPayment: React.FC<ProcessPaymentProps> = ({
  setPaymentProcessed,
  userEmail,
  userId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const reference = `REF-${userId}-${Date.now()}`;
      const result = await initializePayment({
        email: userEmail,
        amount: 2000 * 100, // 2000 Naira
        reference,
      });

      if (result.status && result.data?.authorization_url) {
        window.location.href = result.data.authorization_url;
      } else {
        toast.error(result.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // This function would be called when the user returns from Paystack
  const handlePaymentVerification = async (reference: string) => {
    try {
      const isVerified = await verifyPayment(reference);
      if (isVerified) {
        setPaymentProcessed(true);
        toast.success("Payment successful! 😄");
      } else {
        toast.error("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(
        "An error occurred while verifying your payment. Please contact support."
      );
    }
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
        You will be redirected to Paystack to complete your payment of 2000
        Naira.
      </Small>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={isLoading}
        fullwidth
      >
        {isLoading ? "Processing..." : "Proceed to Payment"}
      </Button>

      <Small color="text.secondary" mt="1rem" display="block">
        By clicking "Proceed to Payment", you agree to our terms of service.
      </Small>
    </Box>
  );
};

export default ProcessPayment;
