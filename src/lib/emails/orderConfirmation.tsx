// emails/OrderConfirmation.tsx
import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface OrderConfirmationProps {
  order: {
    id: string;
    createdAt: Date;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    tax: number;
    shippingCost: number;
    totalPrice: number;
    shippingAddress: {
      name: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container>
        <Section>
          <Text style={heading}>Thank you for your order!</Text>
          <Text>Your order has been confirmed and is being processed.</Text>
        </Section>
        <Section>
          <Text style={subheading}>Order Details:</Text>
          <Text>Order ID: {order.id}</Text>
          <Text>Order Date: {order.createdAt.toLocaleString()}</Text>
        </Section>
        <Section>
          <Text style={subheading}>Items:</Text>
          {order.orderItems.map((item, index) => (
            <Text key={index}>
              {item.name} - Quantity: {item.quantity} - Price: $
              {item.price.toFixed(2)}
            </Text>
          ))}
        </Section>
        <Section>
          <Text>Subtotal: ${order.subtotal.toFixed(2)}</Text>
          <Text>Tax: ${order.tax.toFixed(2)}</Text>
          <Text>Shipping: ${order.shippingCost.toFixed(2)}</Text>
          <Text style={total}>Total: ${order.totalPrice.toFixed(2)}</Text>
        </Section>
        <Section>
          <Text style={subheading}>Shipping Address:</Text>
          <Text>
            {order.shippingAddress.name}
            <br />
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zipCode}
            <br />
            {order.shippingAddress.country}
          </Text>
        </Section>
        <Hr />
        <Section>
          <Text>Thank you for shopping with us!</Text>
          <Button href="https://yourstore.com/orders" style={button}>
            View Your Order
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const subheading = {
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "20px",
  marginBottom: "10px",
};

const total = {
  fontWeight: "bold",
  fontSize: "18px",
};

const button = {
  backgroundColor: "#007bff",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "4px",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "20px",
};

export default OrderConfirmation;
