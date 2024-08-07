"use client";

// components/checkout/CheckoutForm.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import { H6 } from "@component/Typography";
import { Card1 } from "@component/Card1";
import Grid from "@component/grid/Grid";
import { useAppContext } from "@context/app-context";

export default function CheckoutForm() {
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Nigeria", // Default to Nigeria
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, dispatch } = useAppContext();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    return state.cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Create order
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: state.cart,
          shippingAddress,
          email: shippingAddress.email, // Make sure to include email
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { order, paymentDetails } = await response.json();

      // Redirect to Paystack payment page
      window.location.href = paymentDetails.authorizationUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card1 mb="2rem">
        <H6 mb="1rem">Shipping Address</H6>
        <Grid container spacing={6}>
          <Grid item sm={6} xs={12}>
            <TextField
              name="name"
              label="Full Name"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.name}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.email}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="phone"
              label="Phone Number"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.phone}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="street"
              label="Street Address"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.street}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="city"
              label="City"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.city}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="state"
              label="State"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.state}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="zipCode"
              label="Zip Code"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.zipCode}
              required
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              name="country"
              label="Country"
              fullwidth
              mb="1rem"
              onBlur={handleInputChange}
              onChange={handleInputChange}
              value={shippingAddress.country}
              required
            />
          </Grid>
        </Grid>
      </Card1>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        fullwidth
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay ₦${calculateTotal().toFixed(2)}`}
      </Button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </form>
  );
}
