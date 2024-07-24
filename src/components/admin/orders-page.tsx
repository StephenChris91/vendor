// app/admin/orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import OrderStatistics from "@component/admin/order-stats";
import OrderSearchFilter from "@component/admin/order-search";
import OrderList from "@component/admin/order-list";
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
const mockOrders = [
  {
    id: "1",
    customerName: "John Doe",
    orderDate: "2023-07-15",
    totalAmount: 150.0,
    paymentStatus: "Paid",
    fulfillmentStatus: "Shipped",
  },
  {
    id: "2",
    customerName: "Jane Smith",
    orderDate: "2023-07-16",
    totalAmount: 200.5,
    paymentStatus: "Pending",
    fulfillmentStatus: "Processing",
  },
  // Add more mock orders as needed
];

const mockStats = {
  totalOrders: 1000,
  pendingOrders: 50,
  totalRevenue: 15000,
  averageOrderValue: 150,
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [stats, setStats] = useState(mockStats);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // useEffect(() => {
  //   // Fetch orders and stats data
  //   // setOrders(fetchedOrders);
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
    console.log("Bulk action:", action, "on orders:", selectedOrders);
  };

  const handleOrderSelection = (orderId: string, isSelected: boolean) => {
    setSelectedOrders((prev) =>
      isSelected ? [...prev, orderId] : prev.filter((id) => id !== orderId)
    );
  };

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
      />
    </PageWrapper>
  );
}
