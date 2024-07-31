// app/admin/vendors/page.tsx
"use client";

import React, { useEffect, useState } from "react";
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
  console.log("VendorsPage rendered");
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
      console.log("Fetching vendors...");
      try {
        const response = await axios.get("/api/admin/vendors", {
          params: { search: searchTerm, ...filters },
          timeout: 5000, // 5 seconds timeout
        });
        console.log("Vendors fetched:", response.data);
        return response.data as Vendor[];
      } catch (error) {
        console.error("Error fetching vendors:", error);
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config,
          });
        }
        throw error;
      }
    },
    retry: 1,
    staleTime: 60000, // 1 minute
  });

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["vendorStats"],
    queryFn: async () => {
      console.log("Fetching vendor stats...");
      try {
        const response = await axios.get("/api/admin/vendor-stats", {
          timeout: 5000,
        });
        console.log("Vendor stats fetched:", response.data);
        return response.data as VendorStats;
      } catch (error) {
        console.error("Error fetching vendor stats:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 60000, // 1 minute
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      console.log("Toggling vendor status...", data);
      const response = await axios.patch(
        `/api/admin/vendors/${data.id}/status`,
        { status: data.status }
      );
      console.log("Vendor status updated:", response.data);
      return response.data;
    },
    onSuccess: () => {
      console.log("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendorStats"] });
    },
    onError: (error) => {
      console.error("Error updating vendor status:", error);
    },
  });

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    setSearchTerm(query);
  };

  const handleFilter = (newFilters: any) => {
    console.log("New filters:", newFilters);
    setFilters(newFilters);
  };

  const handleViewProfile = (id: string) => {
    console.log("Viewing profile:", id);
    // Implement view profile logic
  };

  const handleEditVendor = (id: string) => {
    console.log("Editing vendor:", id);
    // Implement edit vendor logic
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    console.log("Toggling status for:", id, "Current status:", currentStatus);
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    toggleStatusMutation.mutate({ id, status: newStatus });
  };

  const handleAddVendor = () => {
    console.log("Adding new vendor");
    // Implement add vendor logic
  };

  if (vendorsLoading) {
    console.log("Rendering loading state");
    return <div>Loading...</div>;
  }

  if (vendorsError) {
    console.error("Error loading vendors:", vendorsError);
    return <div>Error loading vendors. Please try again.</div>;
  }

  console.log("Rendering VendorsPage with data");
  return (
    <PageWrapper>
      <FlexBox justifyContent="space-between" alignItems="center" mb={4}>
        <H3>Vendor Management</H3>
        <Button variant="contained" color="primary" onClick={handleAddVendor}>
          Add New Vendor
        </Button>
      </FlexBox>

      {stats && <VendorStatistics {...stats} />}

      <VendorSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      {vendors && (
        <VendorList
          vendors={vendors}
          onViewProfile={handleViewProfile}
          onEditVendor={handleEditVendor}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </PageWrapper>
  );
}
