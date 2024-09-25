"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@context/authContext";

import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import { DashboardNavigationWrapper, StyledDashboardNav } from "./styles";

export default function DashboardNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  const customerLinks = [
    {
      title: "DASHBOARD",
      list: [
        { href: "/orders", title: "Orders", iconName: "bag" },
        { href: "/wish-list", title: "Wishlist", iconName: "heart" },
        {
          href: "/support-tickets",
          title: "Support Tickets",
          iconName: "customer-service",
        },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      list: [
        { href: "/profile", title: "Profile Info", iconName: "user" },
        { href: "/address", title: "Addresses", iconName: "pin" },
        {
          href: "/payment-methods",
          title: "Payment Methods",
          iconName: "credit-card",
        },
      ],
    },
  ];

  const vendorLinks = [
    {
      title: "DASHBOARD",
      list: [
        {
          href: "/vendor/products",
          title: "Products",
          iconName: "box",
        },
        {
          href: "/vendor/products/create",
          title: "Create Product",
          iconName: "plus-circle",
        },
        {
          href: "/vendor/orders",
          title: "Orders",
          iconName: "bag",
        },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      list: [
        {
          href: "/vendor/account-settings",
          title: "Settings",
          iconName: "settings",
        },
      ],
    },
  ];

  if (!user) return null;

  const linkList = user?.role === "Vendor" ? vendorLinks : customerLinks;

  return (
    <DashboardNavigationWrapper
      px="0px"
      pb="1.5rem"
      color="gray.900"
      borderRadius={8}
    >
      {linkList.map((item) => (
        <Fragment key={item.title}>
          <Typography p="26px 30px 1rem" color="text.muted" fontSize="12px">
            {item.title}
          </Typography>

          {item.list.map((listItem) => (
            <StyledDashboardNav
              key={listItem.title}
              px="1.5rem"
              mb="1.25rem"
              href={listItem.href}
              isCurrentPath={pathname.includes(listItem.href)}
            >
              <FlexBox
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <FlexBox alignItems="center">
                  <div className="dashboard-nav-icon-holder">
                    <Icon variant="small" defaultcolor="currentColor" mr="10px">
                      {listItem.iconName}
                    </Icon>
                  </div>
                  <span>{listItem.title}</span>
                </FlexBox>
              </FlexBox>
            </StyledDashboardNav>
          ))}
        </Fragment>
      ))}
    </DashboardNavigationWrapper>
  );
}
