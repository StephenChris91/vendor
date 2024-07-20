// components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@component/Box";
import { H6 } from "@component/Typography";
import FlexBox from "@component/FlexBox";
import Icon from "@component/icon/Icon";
import { Button } from "@component/buttons";

const adminNavItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/vendors", label: "Vendors", icon: "vendor" },
  { href: "/admin/products", label: "Products", icon: "product" },
  { href: "/admin/orders", label: "Orders", icon: "bag" },
  { href: "/admin/customers", label: "Customers", icon: "users" },
  { href: "/admin/settings", label: "Settings", icon: "gear" },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <Box
      width={isOpen ? "250px" : "70px"}
      backgroundColor="gray.200"
      height="100%"
      padding="1rem"
      transition="width 0.3s ease"
    >
      <FlexBox justifyContent="space-between" alignItems="center" mb="2rem">
        {isOpen && <H6>Admin Panel</H6>}
        <Button p="6px" bg="gray.200" onClick={toggleSidebar}>
          <Icon size="20px">{isOpen ? "chevron-left" : "chevron-right"}</Icon>
        </Button>
      </FlexBox>
      <FlexBox flexDirection="column">
        {adminNavItems.map((item) => (
          <Link key={item.href} href={item.href} passHref>
            <FlexBox
              mb="0.5rem"
              padding="0.75rem"
              borderRadius="4px"
              backgroundColor={
                pathname === item.href ? "primary.main" : "transparent"
              }
              color={pathname === item.href ? "primary.text" : "text.primary"}
              alignItems="center"
            >
              <Icon
                mr={isOpen ? "0.5rem" : "0"}
                size="20px"
                color={pathname === item.href ? "primary" : "secondary"}
              >
                {item.icon}
              </Icon>
              {isOpen && item.label}
            </FlexBox>
          </Link>
        ))}
      </FlexBox>
    </Box>
  );
}
