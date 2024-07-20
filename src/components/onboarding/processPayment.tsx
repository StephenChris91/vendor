"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { initializePayment, verifyPayment } from "actions/payment";

const ProcessPayment = ({
  setPaymentProcessed,
  userEmail,
}: {
  setPaymentProcessed: (status: boolean) => void;
  userEmail: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const reference = `REF-${Date.now()}`;
      const result = await initializePayment({
        email: userEmail,
        amount: 2000, // 2000 Naira
        reference,
      });

      if (result.status && result.data?.authorization_url) {
        // Open Paystack payment page
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
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-blue-600 p-4 font-semibold text-white rounded-sm"
    >
      {isLoading ? "Processing..." : "Proceed to Payment"}
    </button>
  );
};

export default ProcessPayment;
