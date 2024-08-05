// app/admin/vendors/page.tsx
"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import { Button } from "@component/buttons";
import VendorList from "@component/admin/vendors/vendor-list";
import VendorSearchFilter from "@component/admin/vendors/vendor-search";
import VendorStatistics from "@component/admin/vendors/vendor-statistics";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

interface Vendor {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: string;
  totalSales: number;
  productCount: number;
  rating: number;
}

interface VendorStats {
  totalVendors: number;
  newVendors: number;
  averageRating: number;
  pendingApprovals: number;
}

export default function VendorsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  const {
    data: vendors,
    isLoading: vendorsLoading,
    error: vendorsError,
  } = useQuery({
    queryKey: ["vendors", searchTerm, filters],
    queryFn: async () => {
      const response = await axios.get("/api/admin/vendors", {
        params: { search: searchTerm, ...filters },
      });
      return response.data;
    },
  });

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["vendorStats"],
    queryFn: async () => {
      const response = await axios.get("/api/admin/vendor-stats");
      return response.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "inactive";
    }) => {
      const response = await axios.patch(`/api/admin/vendors/${id}/status`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendorStats"] });
    },
  });

  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleToggleStatus = (id: string, newStatus: "active" | "inactive") => {
    toggleStatusMutation.mutate({ id, status: newStatus });
  };

  const handleAddVendor = () => {
    // Implement add vendor logic
  };

  if (vendorsLoading) return <div>Loading...</div>;
  if (vendorsError) return <div>Error loading vendors. Please try again.</div>;

  return (
    <Box padding={2}>
      <FlexBox justifyContent="space-between" alignItems="center" mb={4}>
        <H3>Vendor Management</H3>
        <Button variant="contained" color="primary" onClick={handleAddVendor}>
          Add New Vendor
        </Button>
      </FlexBox>

      {!statsLoading && !statsError && stats && <VendorStatistics {...stats} />}

      <VendorSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      {vendors && (
        <VendorList vendors={vendors} onToggleStatus={handleToggleStatus} />
      )}
    </Box>
  );
}
