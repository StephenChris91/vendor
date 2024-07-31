// app/admin/orders/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import OrderSearchFilter from "@component/admin/orders/order-search";
import OrderList from "@component/admin/orders/order-list";
import BulkActions from "@component/admin/bulk-actions-button";
import OrderStatistics from "./order-stats";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

const ResponsiveFlexBox = styled(FlexBox)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

const fetchOrders = async (filters: any): Promise<Order[]> => {
  const response = await fetch(
    "/api/admin/orders?" + new URLSearchParams(filters)
  );
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

const fetchOrderStats = async (): Promise<OrderStats> => {
  const response = await fetch("/api/admin/orders/order-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch order stats");
  }
  return response.json();
};

export default function OrdersPage() {
  const [filters, setFilters] = useState({});
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const { data: orders = [], isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["orders", filters],
    queryFn: () => fetchOrders(filters),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery<OrderStats>({
    queryKey: ["orderStats"],
    queryFn: fetchOrderStats,
  });

  const updateOrderMutation = useMutation({
    mutationFn: (updatedOrder: Partial<Order>) =>
      fetch(`/api/admin/orders/${updatedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
    },
  });

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleFilter = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleBulkAction = async (action: string) => {
    for (const orderId of selectedOrders) {
      switch (action) {
        case "markAsPaid":
          await updateOrderMutation.mutateAsync({
            id: orderId,
            paymentStatus: "Paid",
          });
          break;
        case "markAsShipped":
          await updateOrderMutation.mutateAsync({
            id: orderId,
            fulfillmentStatus: "Shipped",
          });
          break;
        case "cancel":
          await updateOrderMutation.mutateAsync({
            id: orderId,
            fulfillmentStatus: "Cancelled",
          });
          break;
      }
    }
    setSelectedOrders([]);
  };

  const handleOrderSelection = (orderId: string, isSelected: boolean) => {
    setSelectedOrders((prev) =>
      isSelected ? [...prev, orderId] : prev.filter((id) => id !== orderId)
    );
  };

  if (isLoadingOrders || isLoadingStats) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <ResponsiveFlexBox
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <H3>Order Management</H3>
      </ResponsiveFlexBox>

      <OrderStatistics stats={stats} />

      <OrderSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      <BulkActions
        selectedCount={selectedOrders.length}
        onAction={handleBulkAction}
      />

      <OrderList
        orders={orders}
        onSelect={handleOrderSelection}
        selectedOrders={selectedOrders}
        onUpdateOrder={updateOrderMutation.mutate}
      />
    </PageWrapper>
  );
}
