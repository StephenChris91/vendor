// app/admin/customers/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import CustomerSearchFilter from "@component/admin/customers/customer-search";
import CustomerList from "@component/admin/customers/customer-list";
import BulkActions from "@component/admin/bulk-actions-button";
import CustomerStatistics from "./customer-stats";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

const ResponsiveFlexBox = styled(FlexBox)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface Customer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
}

interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  averageSpend: number;
}

const fetchCustomers = async (filters: any): Promise<Customer[]> => {
  const response = await fetch(
    "/api/admin/customers?" + new URLSearchParams(filters)
  );
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  return response.json();
};

const fetchCustomerStats = async (): Promise<CustomerStats> => {
  const response = await fetch("/api/admin/customers/customer-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch customer stats");
  }
  return response.json();
};

export default function CustomersPage() {
  const [filters, setFilters] = useState({});
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery<
    Customer[]
  >({
    queryKey: ["customers", filters],
    queryFn: () => fetchCustomers(filters),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<CustomerStats>({
    queryKey: ["customerStats"],
    queryFn: fetchCustomerStats,
  });

  const updateCustomerMutation = useMutation({
    mutationFn: (updatedCustomer: Partial<Customer>) =>
      fetch(`/api/admin/customers/${updatedCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customerStats"] });
    },
  });

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilter = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleBulkAction = async (action: string) => {
    for (const customerId of selectedCustomers) {
      switch (action) {
        case "activate":
          await updateCustomerMutation.mutateAsync({
            id: customerId,
            status: "Active",
          });
          break;
        case "deactivate":
          await updateCustomerMutation.mutateAsync({
            id: customerId,
            status: "Inactive",
          });
          break;
      }
    }
    setSelectedCustomers([]);
  };

  const handleCustomerSelection = (customerId: string, isSelected: boolean) => {
    setSelectedCustomers((prev) =>
      isSelected
        ? [...prev, customerId]
        : prev.filter((id) => id !== customerId)
    );
  };

  if (isLoadingCustomers || isLoadingStats) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <ResponsiveFlexBox
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <H3>Customer Management</H3>
      </ResponsiveFlexBox>

      <CustomerStatistics stats={stats} isLoading={isLoadingStats} />

      <CustomerSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      <BulkActions
        selectedCount={selectedCustomers.length}
        onAction={handleBulkAction}
      />

      <CustomerList
        customers={customers}
        onSelect={handleCustomerSelection}
        selectedCustomers={selectedCustomers}
        onUpdateCustomer={updateCustomerMutation.mutate}
      />
    </PageWrapper>
  );
}
