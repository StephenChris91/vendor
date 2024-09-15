// app/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import KPICard from "@component/admin/kpi-card";
import SalesTrendChart from "@component/admin/sales-trend";
import RecentOrders from "@component/admin/recent-orders";
import RecentActivities from "@component/admin/recent-activities";
import QuickActionButtons from "@component/admin/quick-action";
import { useDashboardData } from "hooks/useDashboardData";
import { generateReports } from "utils/reportGenerator";
import { FcSalesPerformance, FcShop } from "react-icons/fc";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { currency } from '@utils/utils'
import {
  DashboardWrapper,
  KPIWrapper,
  SideSection,
  LoadingOverlay,
  ChartWrapper,
} from "./styles";

export default function AdminDashboard() {
  const { data, isLoading, error, isError, isFetching } = useDashboardData();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleAddProduct = () => {
    console.log("Add product clicked");
  };

  const handleViewOrders = () => {
    console.log("View orders clicked");
  };

  const handleManageVendors = () => {
    console.log("Manage vendors clicked");
  };

  const handleGenerateReport = () => {
    if (!data) {
      console.error("No data available for report generation");
      return;
    }

    try {
      setIsGeneratingReport(true);
      generateReports(data);
    } catch (err) {
      console.error("Error generating reports:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <LoadingOverlay>
        <Paragraph color="white">Loading dashboard data...</Paragraph>
      </LoadingOverlay>
    );
  }

  if (isError) {
    return (
      <DashboardWrapper>
        <Paragraph color="error.main">
          Error loading dashboard data: {error?.message || "Unknown error"}
        </Paragraph>
      </DashboardWrapper>
    );
  }

  if (!data) {
    return (
      <DashboardWrapper>
        <Paragraph>No dashboard data available</Paragraph>
      </DashboardWrapper>
    );
  }

  return (
    <DashboardWrapper>
      <FlexBox justifyContent="space-between" alignItems="center" mb="2rem">
        <H3>Dashboard Overview</H3>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
        >
          Generate Report
        </Button>
      </FlexBox>

      <KPIWrapper>
        <KPICard
          title="Total Sales"
          value={`${currency(data.totalSales)}`}
          icon={<FcSalesPerformance />}
          trend={{ value: 0, isPositive: true }}
        />
        <KPICard
          title="Total Orders"
          value={data.totalOrders.toString()}
          icon={<RiShoppingBasket2Line />}
          trend={{ value: 0, isPositive: true }}
        />
        <KPICard
          title="Active Users"
          value={data.activeUsers.toString()}
          icon={<FaUsers />}
          trend={{ value: 0, isPositive: true }}
        />
        <KPICard
          title="Active Vendors"
          value={data.activeVendors.toString()}
          icon={<FcShop />}
          trend={{ value: 0, isPositive: true }}
        />
      </KPIWrapper>

      <ChartWrapper>
        <Box flex="2" minWidth="300px">
          <SalesTrendChart data={data.salesData} />
        </Box>
        <SideSection flex="1" minWidth="300px">
          <RecentOrders orders={data.recentOrders} />
          <RecentActivities activities={data.recentActivities} />
          <QuickActionButtons
            onAddProduct={handleAddProduct}
            onViewOrders={handleViewOrders}
            onManageVendors={handleManageVendors}
          />
        </SideSection>
      </ChartWrapper>

      {isGeneratingReport && (
        <LoadingOverlay>
          <Paragraph color="white">Generating Reports...</Paragraph>
        </LoadingOverlay>
      )}
    </DashboardWrapper>
  );
}