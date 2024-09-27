"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import { Button } from "@component/buttons";
import PaystackPop from "@paystack/inline-js";

interface ProcessPaymentProps {
  setPaymentProcessed: (status: boolean) => void;
  userEmail: string;
  userId: string;
  onPaymentSuccess: () => void;
  setStepValidation: (isValid: boolean) => void;
}

const ProcessPayment: React.FC<ProcessPaymentProps> = ({
  setPaymentProcessed,
  userEmail,
  userId,
  onPaymentSuccess,
  setStepValidation,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStepValidation(false);
  }, []);

  const handleSuccess = (response: any) => {
    console.log("Payment successful:", response);

    const payload = {
      transactionRef: response.reference,
      userId: userId,
    };

    // Send payment info to the server
    fetch("/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          console.log("Server response:", data);
          onPaymentSuccess(); // Trigger the next step
        }
      })
      .catch((err) => console.error("Payment processing error:", err));
  };

  const handlePayment = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const successRef = `REF-${userId}-${Date.now()}`;

    try {
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key:
          process.env.NODE_ENV !== "production"
            ? process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!
            : process.env.NEXT_PUBLIC_PAYSTACK_LIVE_KEY!,
        email: userEmail,
        amount: 200000, // 2000 Naira in kobo
        ref: successRef,
        onSuccess: (response: any) => {
          setIsLoading(false);
          handleSuccess(response);
        },
        onCancel: () => {
          setIsLoading(false);
          toast.error("Payment cancelled. Please try again.");
        },
      });
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error("An unexpected error occurred while initiating the payment.");
      setIsLoading(false);
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
        You will be prompted to complete your payment of 2000 Naira via
        Paystack.
      </Small>

      <Button
        onClick={handlePayment}
        disabled={isLoading}
        variant="contained"
        color="primary"
        fullwidth
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </Button>

      <Small color="text.secondary" mt="1rem" display="block">
        By clicking "Pay Now", you agree to our terms of service.
      </Small>
    </Box>
  );
};

export default ProcessPayment;
