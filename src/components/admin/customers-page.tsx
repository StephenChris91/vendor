// app/admin/customers/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import CustomerStatistics from "@component/admin/customer-stats";
import CustomerSearchFilter from "@component/admin/customer-search";
import CustomerList from "@component/admin/customer-list";
import BulkActions from "@component/admin/bulk-actions-button";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

const ResponsiveFlexBox = styled(FlexBox)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Mock data - replace with actual API calls in production
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    registrationDate: "2023-01-15",
    totalOrders: 5,
    totalSpent: 500,
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    registrationDate: "2023-02-20",
    totalOrders: 3,
    totalSpent: 300,
    status: "Active",
  },
  // Add more mock customers as needed
];

const mockStats = {
  totalCustomers: 1000,
  newCustomers: 50,
  averageSpend: 250,
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [stats, setStats] = useState(mockStats);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // useEffect(() => {
  //   // Fetch customers and stats data
  //   // setCustomers(fetchedCustomers);
  //   // setStats(fetchedStats);
  // }, []);

  const handleSearch = (query: string) => {
    // Implement search logic
    console.log("Searching for:", query);
  };

  const handleFilter = (filters: any) => {
    // Implement filter logic
    console.log("Applying filters:", filters);
  };

  const handleBulkAction = (action: string) => {
    // Implement bulk action logic
    console.log("Bulk action:", action, "on customers:", selectedCustomers);
  };

  const handleCustomerSelection = (customerId: string, isSelected: boolean) => {
    setSelectedCustomers((prev) =>
      isSelected
        ? [...prev, customerId]
        : prev.filter((id) => id !== customerId)
    );
  };

  return (
    <PageWrapper>
      <ResponsiveFlexBox
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <H3>Customer Management</H3>
      </ResponsiveFlexBox>

      <CustomerStatistics stats={stats} />

      <CustomerSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      <BulkActions
        selectedCount={selectedCustomers.length}
        onAction={handleBulkAction}
      />

      <CustomerList
        customers={customers}
        onSelect={handleCustomerSelection}
        selectedCustomers={selectedCustomers}
      />
    </PageWrapper>
  );
}
