"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { Button } from "@component/buttons";
import Typography, { H6, Paragraph } from "@component/Typography";
import { Card1 } from "@component/Card1";
import { useCart } from "hooks/useCart";
import { currency } from "@utils/utils";
import FlexBox from "@component/FlexBox";
import Divider from "@component/Divider";
import { useCurrentUser } from "@lib/use-session-client";
export default function CheckoutForm() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useCurrentUser();
  const {
    cartItems,
    cartTotal,
    selectedShippingRates,
    totalWithShipping,
    shippingAddress,
    clearCart,
  } = useCart();
  const router = useRouter();

  const tax = totalWithShipping * 0.05; // Assuming 5% tax
  const totalAmount = totalWithShipping + tax;

  const totalShippingCost = Object.values(selectedShippingRates).reduce(
    (sum, rate) => sum + rate?.amount,
    0
  );

  const config = {
    reference: new Date().getTime().toString(),
    email: shippingAddress?.email || user?.email,
    amount: Math.round(totalAmount * 100), // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_LIVE_KEY!,
  };

  const onSuccess = async (reference: any) => {
    try {
      // Create order in your database
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress,
          totalAmount,
          paymentReference: reference.reference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order } = await response.json();
      console.log(order.id);

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setError(
        "An error occurred while processing your order. Please contact support."
      );
      setIsProcessing(false);
    }
  };

  const onClose = () => {
    setError("Payment was not completed.");
    setIsProcessing(false);
  };

  const initializePayment = usePaystackPayment(config);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    initializePayment({
      onSuccess: (reference: any) => onSuccess(reference),
      onClose: () => onClose(),
    } as any); // Type assertion to avoid TypeScript errors
  };

  if (!shippingAddress) {
    return null; // Return null to avoid rendering anything while redirecting
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card1 mb="2rem">
        <H6 mb="1rem">Order Summary</H6>
        {cartItems.map((item) => (
          <FlexBox key={item.id} justifyContent="space-between" mb="0.5rem">
            <Paragraph>
              {item.name} x {item.quantity}
            </Paragraph>
            <Paragraph>{currency(item.price * item.quantity)}</Paragraph>
          </FlexBox>
        ))}
        <Divider my="1rem" />
        <FlexBox justifyContent="space-between" mb="0.5rem">
          <Paragraph>Subtotal:</Paragraph>
          <Paragraph>{currency(cartTotal)}</Paragraph>
        </FlexBox>
        <FlexBox justifyContent="space-between" mb="0.5rem">
          <Paragraph>Shipping:</Paragraph>
          <Paragraph>{currency(totalShippingCost)}</Paragraph>
        </FlexBox>
        <FlexBox justifyContent="space-between" mb="0.5rem">
          <Paragraph>Tax (5%):</Paragraph>
          <Paragraph>{currency(tax)}</Paragraph>
        </FlexBox>
        <Divider my="1rem" />
        <FlexBox justifyContent="space-between" mb="1rem">
          <H6>Total:</H6>
          <H6>{currency(totalAmount)}</H6>
        </FlexBox>
      </Card1>

      <Card1 mb="2rem">
        <H6 mb="1rem">Shipping Address</H6>
        <Paragraph>{shippingAddress.name || "N/A"}</Paragraph>
        <Paragraph>{shippingAddress.street || "N/A"}</Paragraph>
        <Paragraph>{`${shippingAddress.city || "N/A"}, ${
          shippingAddress.state || "N/A"
        } ${shippingAddress.zipCode || "N/A"}`}</Paragraph>
        <Paragraph>{shippingAddress.country || "N/A"}</Paragraph>
        <Paragraph>{shippingAddress.phone || "N/A"}</Paragraph>
        <Paragraph>{shippingAddress.email || "N/A"}</Paragraph>
      </Card1>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullwidth
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay ${currency(totalAmount)}`}
      </Button>

      {error && (
        <Paragraph color="error.main" mt="1rem">
          {error}
        </Paragraph>
      )}
    </form>
  );
}
