// app/admin/vendors/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import { Button } from "@component/buttons";
import VendorList from "@component/admin/vendor-list";
import VendorSearchFilter from "@component/admin/vendor-search";
import VendorStatistics from "@component/admin/vendor-statistics";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

// Mock data - replace with actual API calls in production
const mockVendors = [
  {
    id: "1",
    name: "Vendor 1",
    email: "vendor1@example.com",
    registrationDate: "2023-01-15",
    status: "active",
    totalSales: 50000,
    productCount: 100,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Vendor 2",
    email: "vendor2@example.com",
    registrationDate: "2023-02-20",
    status: "inactive",
    totalSales: 30000,
    productCount: 75,
    rating: 3.8,
  },
  {
    id: "3",
    name: "Vendor 3",
    email: "vendor3@example.com",
    registrationDate: "2023-03-10",
    status: "pending",
    totalSales: 0,
    productCount: 50,
    rating: 0,
  },
  // Add more mock vendors as needed
];

const mockStats = {
  totalVendors: 100,
  newVendors: 15,
  averageRating: 4.2,
  pendingApprovals: 5,
};

export default function VendorsPage() {
  const [vendors, setVendors] = useState(mockVendors);
  const [stats, setStats] = useState(mockStats);

  // useEffect(() => {
  //   // Fetch vendors and stats data
  //   // setVendors(fetchedVendors);
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

  const handleViewProfile = (id: string) => {
    // Implement view profile logic
    console.log("Viewing profile:", id);
  };

  const handleEditVendor = (id: string) => {
    // Implement edit vendor logic
    console.log("Editing vendor:", id);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    // Implement toggle status logic
    console.log("Toggling status for:", id, "Current status:", currentStatus);
  };

  const handleAddVendor = () => {
    // Implement add vendor logic
    console.log("Adding new vendor");
  };

  return (
    <PageWrapper>
      <FlexBox justifyContent="space-between" alignItems="center" mb={4}>
        <H3>Vendor Management</H3>
        <Button variant="contained" color="primary" onClick={handleAddVendor}>
          Add New Vendor
        </Button>
      </FlexBox>

      <VendorStatistics {...stats} />

      <VendorSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      <VendorList
        vendors={vendors}
        onViewProfile={handleViewProfile}
        onEditVendor={handleEditVendor}
        onToggleStatus={handleToggleStatus}
      />
    </PageWrapper>
  );
}
