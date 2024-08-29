// app/admin/settings/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
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
import CarouselSettings from "@component/admin/carousel-settings";
import toast from "react-hot-toast";
import { CreateCarouselItemInput } from "types";

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
  { title: "Carousel", value: "carousel" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleTabChange = useCallback(
    (value: string) => {
      if (hasUnsavedChanges) {
        const confirmChange = window.confirm(
          "You have unsaved changes. Are you sure you want to switch tabs?"
        );
        if (!confirmChange) return;
      }
      setActiveTab(value);
    },
    [hasUnsavedChanges]
  );

  const createCarouselItem = useCallback(
    async (carouselItem: CreateCarouselItemInput) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/carousel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carouselItem),
        });

        if (!response.ok) {
          throw new Error("Failed to create carousel item");
        }

        const newItem = await response.json();
        console.log("New carousel item created:", newItem);
        toast.success("Carousel item created successfully");
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Error creating carousel item:", error);
        toast.error("Failed to create carousel item");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSaveAllChanges = useCallback(async () => {
    setIsLoading(true);
    try {
      // Implement logic to save all changes across different settings
      // This could involve multiple API calls or a single call to save all settings
      await Promise.all([
        // Add promises for saving each setting type
      ]);
      toast.success("All changes saved successfully");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save all changes");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "user-account":
        return (
          <UserAccountSettings setHasUnsavedChanges={setHasUnsavedChanges} />
        );
      case "email":
        return <EmailSettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "payment":
        return <PaymentSettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "shipping":
        return <ShippingSettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "tax":
        return <TaxSettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "commission":
        return (
          <CommissionSettings setHasUnsavedChanges={setHasUnsavedChanges} />
        );
      case "notifications":
        return (
          <NotificationSettings setHasUnsavedChanges={setHasUnsavedChanges} />
        );
      case "api":
        return <APISettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "security":
        return <SecuritySettings setHasUnsavedChanges={setHasUnsavedChanges} />;
      case "carousel":
        return (
          <CarouselSettings
            createCarouselItem={createCarouselItem}
            setHasUnsavedChanges={setHasUnsavedChanges}
          />
        );
      default:
        return <div>Invalid tab selected</div>;
    }
  }, [activeTab, createCarouselItem]);

  return (
    <PageWrapper>
      <FlexBox justifyContent="space-between" alignItems="center" mb={4}>
        <H3>Settings</H3>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveAllChanges}
          disabled={isLoading || !hasUnsavedChanges}
        >
          {isLoading ? "Saving..." : "Save All Changes"}
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
                disabled={isLoading}
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
