// emails/VendorNotificationEmail.tsx
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
import Typography from "@component/Typography";

interface VendorNotificationEmailProps {
  vendorName: string;
  shopName: string;
  orderId: string;
  orderDate: string;
  orderItems: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export const VendorNotificationEmail: React.FC<
  VendorNotificationEmailProps
> = ({
  vendorName,
  shopName,
  orderId,
  orderDate,
  orderItems,
  subtotal,
  tax,
  shippingCost,
  total,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container>
        <Section>
          <Text style={heading}>New Order Received</Text>
          <Text>Dear {vendorName},</Text>
          <Text>
            You have received a new order for your shop{" "}
            <Typography as="h2" fontWeight="600">
              {shopName}.
            </Typography>
          </Text>
          <Text>Order #: {orderId}</Text>
          <Text>Order Date: {orderDate}</Text>
        </Section>
        <Section>
          <Text style={subheading}>Order Details:</Text>
          <table style={table}>
            <thead>
              <tr>
                <th style={tableHeader}>Product</th>
                <th style={tableHeader}>Quantity</th>
                <th style={tableHeader}>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td style={tableCell}>{item.name}</td>
                  <td style={tableCell}>{item.quantity}</td>
                  <td style={tableCell}>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
        <Section>
          <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text>Tax: ${tax.toFixed(2)}</Text>
          <Text>Shipping: ${shippingCost.toFixed(2)}</Text>
          <Text style={totalStyle}>Total: ${total.toFixed(2)}</Text>
        </Section>
        <Hr />
        <Section>
          <Text>
            Please log in to your vendor dashboard to process this order.
          </Text>
          <Button href="https://vendorspot.com/vendor/dashboard" style={button}>
            Go to Dashboard
          </Button>
        </Section>
        <Text>Thank you for your prompt attention to this matter.</Text>
      </Container>
    </Body>
  </Html>
);

// Styles
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
const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
};
const tableHeader = {
  backgroundColor: "#f4f4f4",
  padding: "10px",
  textAlign: "left" as const,
};
const tableCell = {
  padding: "10px",
  borderTop: "1px solid #ddd",
};
const totalStyle = {
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

export default VendorNotificationEmail;
