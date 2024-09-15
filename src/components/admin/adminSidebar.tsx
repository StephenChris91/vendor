// components/admin/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@component/Box";
import { H6 } from "@component/Typography";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { IconType } from "react-icons";
import { FaStore, FaBox, FaShoppingCart, FaUsers, FaCog } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { MdSpaceDashboard } from "react-icons/md";

interface AdminNavItem {
  href: string;
  label: string;
  icon: IconType;
}

const adminNavItems: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: MdSpaceDashboard },
  { href: "/admin/vendors", label: "Vendors", icon: FaStore },
  { href: "/admin/products", label: "Products", icon: FaBox },
  { href: "/admin/orders", label: "Orders", icon: FaShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: FaUsers },
  { href: "/admin/settings", label: "Settings", icon: FaCog },
];

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <Box
      width={isOpen ? "250px" : "70px"}
      backgroundColor="primary.800"
      height="100%"
      padding="1rem"
      transition="width 0.3s ease"
    >
      <FlexBox justifyContent="space-between" alignItems="center" mb="2rem">
        {isOpen && <H6 color="white">Admin Panel</H6>}
        <Button p="6px" bg="gray.200" onClick={toggleSidebar}>
          {isOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
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
              color={pathname === item.href ? "secondary.text" : "white"}
              alignItems="center"
            >
              <item.icon
                size={20}
                style={{
                  marginRight: isOpen ? "0.5rem" : "0",
                  color: pathname === item.href ? "secondary.text" : "white",
                }}
              />
              {isOpen && item.label}
            </FlexBox>
          </Link>
        ))}
      </FlexBox>
    </Box>
  );
}
