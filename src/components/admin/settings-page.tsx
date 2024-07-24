// app/admin/settings/page.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3, H5 } from "@component/Typography";
import { Button } from "@component/buttons";
import GeneralSettings from "@component/admin/general-settings";
import UserAccountSettings from "@component/admin/user-account-settings";
import EmailSettings from "@component/admin/email-settings";
import PaymentSettings from "@component/admin/payment-settings";
import ShippingSettings from "@component/admin/shipping-settings";
import TaxSettings from "@component/admin/tax-settings";
import CommissionSettings from "@component/admin/commission-settings";
import NotificationSettings from "@component/admin/notifications-settings";
import APISettings from "@component/admin/api-settings";
import SecuritySettings from "@component/admin/security-settings";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

const SettingsWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 2rem;
`;

const NavButton = styled(Button)<{ isActive: boolean }>`
  margin-right: 1rem;
  margin-bottom: 1rem;
  ${(props) =>
    props.isActive &&
    `
    background-color: ${props.theme.colors.primary.main};
    color: ${props.theme.colors.primary.text};
  `}
`;

const navItems = [
  { title: "General", value: "general" },
  { title: "User Account", value: "user-account" },
  { title: "Email", value: "email" },
  { title: "Payment", value: "payment" },
  { title: "Shipping", value: "shipping" },
  { title: "Tax", value: "tax" },
  { title: "Commission", value: "commission" },
  { title: "Notifications", value: "notifications" },
  { title: "API", value: "api" },
  { title: "Security", value: "security" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />;
      case "user-account":
        return <UserAccountSettings />;
      case "email":
        return <EmailSettings />;
      case "payment":
        return <PaymentSettings />;
      case "shipping":
        return <ShippingSettings />;
      case "tax":
        return <TaxSettings />;
      case "commission":
        return <CommissionSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "api":
        return <APISettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <FlexBox justifyContent="space-between" alignItems="center" mb={4}>
        <H3>Settings</H3>
        <Button variant="contained" color="primary">
          Save All Changes
        </Button>
      </FlexBox>

      <SettingsWrapper>
        <Box mb={4}>
          <FlexBox flexWrap="wrap">
            {navItems.map((item) => (
              <NavButton
                key={item.value}
                variant="outlined"
                isActive={activeTab === item.value}
                onClick={() => handleTabChange(item.value)}
              >
                {item.title}
              </NavButton>
            ))}
          </FlexBox>
        </Box>

        <Box>{renderTabContent()}</Box>
      </SettingsWrapper>
    </PageWrapper>
  );
}
