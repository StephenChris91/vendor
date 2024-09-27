"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Box from "@component/Box";
import { H5, Small } from "@component/Typography";
import { updatePaymentStatus } from "actions/update-payment-status";
import { Button } from "@component/buttons";

interface ProcessPaymentProps {
  setPaymentProcessed: (status: boolean) => void;
  userEmail: string;
  userId: string;
  onPaymentSuccess: () => void;
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
  onPaymentSuccess,
  setStepValidation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    setStepValidation(false);

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
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
          // Move to the next step (UploadVerificationDocuments)
          onPaymentSuccess(); // Trigger the next step
        }
      })
      .catch((err) => console.error("Payment processing error:", err));
  };

  const handlePayment = (e: React.MouseEvent) => {
    e.preventDefault();

    const successRef = `REF-${userId}-${Date.now()}`;

    if (window.PaystackPop && scriptLoaded) {
      const handler = window.PaystackPop.setup({
        key:
          process.env.NODE_ENV !== "production"
            ? process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
            : process.env.PAYSTACK_LIVE_SECRET_KEY,
        email: userEmail,
        amount: 200000, // 2000 Naira in kobo
        ref: successRef,
        callback: (response: any) => handleSuccess(response), // Pass the full response here
        onClose: () => {
          toast.error("Payment cancelled. Please try again.");
        },
      });
      handler.openIframe();
    } else {
      toast.error("Payment system is not ready. Please try again.");
    }
  };

  // const handlePayment = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   try {
  //     if (window.PaystackPop && scriptLoaded) {
  //       const handler = window.PaystackPop.setup({
  //         key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  //         email: userEmail,
  //         amount: 200000, // 2000 Naira in kobo
  //         ref: `REF-${userId}-${Date.now()}`,
  //         callback: handleSuccess,
  //         onClose: () => {
  //           toast.error("Payment cancelled. Please try again.");
  //         },
  //       });
  //       handler.openIframe();
  //     } else {
  //       toast.error("Payment system is not ready. Please try again.");
  //     }
  //   } catch (error) {
  //     console.error("Error initiating payment:", error);
  //     toast.error("An unexpected error occurred while initiating the payment.");
  //   }
  // };

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

      {scriptLoaded ? (
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          variant="contained"
          color="primary"
          fullwidth
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      ) : (
        <Button variant="contained" color="primary" fullwidth disabled>
          Loading payment system...
        </Button>
      )}

      <Small color="text.secondary" mt="1rem" display="block">
        By clicking "Pay Now", you agree to our terms of service.
      </Small>
    </Box>
  );
};

export default ProcessPayment;
