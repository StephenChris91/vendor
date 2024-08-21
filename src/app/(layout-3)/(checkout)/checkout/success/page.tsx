"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@component/buttons";
import { H2, H4, Paragraph } from "@component/Typography";
import FlexBox from "@component/FlexBox";
import Card from "@component/Card";
import Divider from "@component/Divider";
import { currency } from "@utils/utils";
import Spinner from "@component/Spinner";

interface OrderSummaryItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummary {
  orderId: string;
  items: OrderSummaryItem[];
  totalAmount: number;
}

const Success = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const orderId = searchParams.get("orderId"); // Change this to match the query parameter
      console.log("OrderId from URL:", orderId);

      if (!orderId) {
        setError("No order ID found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/order/${orderId}`);
        console.log("API Response:", response);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        console.log("Order data:", data);
        setOrderSummary(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("An error occurred while fetching the order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card p={4} mb={4}>
      <FlexBox flexDirection="column" alignItems="center" mb={4}>
        <CheckCircle size={64} color="green" />
        <H2 mt={2}>Order Placed Successfully!</H2>
      </FlexBox>

      {orderSummary && (
        <>
          <H4 mb={2}>Order Summary</H4>
          <Paragraph mb={2}>Order ID: {orderSummary.orderId}</Paragraph>
          <Divider mb={2} />
          {orderSummary.items.map((item, index) => (
            <FlexBox key={index} justifyContent="space-between" mb={1}>
              <Paragraph>
                {item.name} x{item.quantity}
              </Paragraph>
              <Paragraph>{currency(item.price)}</Paragraph>
            </FlexBox>
          ))}
          <Divider my={2} />
          <FlexBox justifyContent="space-between">
            <H4>Total</H4>
            <H4>{currency(orderSummary.totalAmount)}</H4>
          </FlexBox>
        </>
      )}

      <Button
        mt={4}
        variant="contained"
        color="primary"
        fullwidth
        onClick={() => router.push("/profile")}
      >
        Go to Profile
      </Button>
    </Card>
  );
};

export default Success;
