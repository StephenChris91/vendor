"use client";

import { Fragment, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@context/authContext";

import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import Typography from "@component/Typography";
import { DashboardNavigationWrapper, StyledDashboardNav } from "./styles";

export default function DashboardNavigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = useState({});

  const customerLinks = [
    {
      title: "DASHBOARD",
      list: [
        { href: "/orders", title: "Orders", iconName: "bag", count: 5 },
        { href: "/wish-list", title: "Wishlist", iconName: "heart", count: 19 },
        {
          href: "/support-tickets",
          title: "Support Tickets",
          iconName: "customer-service",
          count: 1,
        },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      list: [
        { href: "/profile", title: "Profile Info", iconName: "user", count: 3 },
        { href: "/address", title: "Addresses", iconName: "pin", count: 16 },
        {
          href: "/payment-methods",
          title: "Payment Methods",
          iconName: "credit-card",
          count: 4,
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
          count: null,
          subItems: [
            {
              href: "/vendor/products/create",
              title: "Create Product",
              iconName: "plus-circle",
            },
          ],
        },
        {
          href: "/vendor/orders",
          title: "Orders",
          iconName: "bag",
          count: null,
        },
        // {
        //   href: "/vendor/customers",
        //   title: "Customers",
        //   iconName: "user-group",
        //   count: null,
        // },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      list: [
        // {
        //   href: "/vendor/profile",
        //   title: "Profile Info",
        //   iconName: "user",
        //   count: null,
        // },
        {
          href: "/vendor/account-settings",
          title: "Settings",
          iconName: "settings",
          count: null,
        },
      ],
    },
  ];

  const linkList = user?.role === "Vendor" ? vendorLinks : customerLinks;

  const toggleExpand = (title) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

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
            <Fragment key={listItem.title}>
              <StyledDashboardNav
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
                      <Icon
                        variant="small"
                        defaultcolor="currentColor"
                        mr="10px"
                      >
                        {listItem.iconName}
                      </Icon>
                    </div>
                    <span>{listItem.title}</span>
                  </FlexBox>
                  {listItem.subItems && (
                    <Icon
                      variant="small"
                      defaultcolor="currentColor"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleExpand(listItem.title);
                      }}
                    >
                      {expandedItems[listItem.title] ? "minus" : "plus"}
                    </Icon>
                  )}
                </FlexBox>
                {listItem.count !== null && <span>{listItem.count}</span>}
              </StyledDashboardNav>
              {listItem.subItems && expandedItems[listItem.title] && (
                <Fragment>
                  {listItem.subItems.map((subItem) => (
                    <StyledDashboardNav
                      key={subItem.title}
                      px="3rem"
                      mb="1.25rem"
                      href={subItem.href}
                      isCurrentPath={pathname.includes(subItem.href)}
                    >
                      <FlexBox alignItems="center">
                        <div className="dashboard-nav-icon-holder">
                          <Icon
                            variant="small"
                            defaultcolor="currentColor"
                            mr="10px"
                          >
                            {subItem.iconName}
                          </Icon>
                        </div>
                        <span>{subItem.title}</span>
                      </FlexBox>
                    </StyledDashboardNav>
                  ))}
                </Fragment>
              )}
            </Fragment>
          ))}
        </Fragment>
      ))}
    </DashboardNavigationWrapper>
  );
}
