import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
  Img,
} from "@react-email/components";

interface VerificationEmailProps {
  userId: string;
  userEmail: string;
  documentCount: number;
}

export const VerificationEmail: React.FC<VerificationEmailProps> = ({
  userId,
  userEmail,
  documentCount,
}) => {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f3f4f6", margin: 0, padding: 0 }}>
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "24px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Img
              style={{
                margin: "0 auto",
              }}
              src="/public/assets/images/logo-2.svg"
              width="64"
              height="64"
              alt="Logo"
            ></Img>
            <Text
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "16px",
                color: "#fff",
                textAlign: "center",
                backgroundColor: "#0071FC",
                padding: "8px",
                borderRadius: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.2px",
              }}
            >
              New Verification Documents Submitted
            </Text>
            <Text style={{ marginBottom: "16px" }}>
              New verification documents have been submitted for review. Please
              find the details below:
            </Text>
            <Section style={{ marginBottom: "16px" }}>
              <Text style={{ fontWeight: "bold" }}>User ID:</Text>
              <Text style={{ marginLeft: "8px" }}>{userId}</Text>
            </Section>
            <Section style={{ marginBottom: "16px" }}>
              <Text style={{ fontWeight: "bold" }}>User Email:</Text>
              <Text style={{ marginLeft: "8px" }}>{userEmail}</Text>
            </Section>
            <Section style={{ marginBottom: "16px" }}>
              <Text style={{ fontWeight: "bold" }}>Number of Documents:</Text>
              <Text style={{ marginLeft: "8px" }}>{documentCount}</Text>
            </Section>
            <Text style={{ marginBottom: "16px" }}>
              Please review the attached documents and update the user's
              verification status accordingly.
            </Text>
            <Button
              href={`${process.env.NEXT_PUBLIC_ADMIN_DASHBOARD_URL}/users/${userId}`}
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "12px 16px",
                borderRadius: "4px",
                textDecoration: "none",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Review User Profile
            </Button>
          </Section>
          <Section
            style={{
              marginTop: "32px",
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            <Text>
              This is an automated message from Vendorspot. Please do not reply
              to this email.
            </Text>
            <Link
              href="https://vendorspot.ng"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              Vendorspot.ng
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;
