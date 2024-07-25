// app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import KPICard from "@component/admin/kpi-card";
import SalesTrendChart from "@component/admin/sales-trend";
import RecentOrders from "@component/admin/recent-orders";
import RecentActivities from "@component/admin/recent-activities";
import QuickActionButtons from "@component/admin/quick-action";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  useDashboardData,
  DashboardData,
  Activity,
} from "hooks/useDashboardData";

import {
  DashboardWrapper,
  KPIWrapper,
  SideSection,
  LoadingOverlay,
  ChartWrapper,
} from "./styles";

export default function AdminDashboard() {
  console.log("AdminDashboard component rendered");
  const { data, isLoading, error, isError, isFetching, status } =
    useDashboardData();
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    console.log("useEffect in AdminDashboard triggered");
    console.log("isLoading:", isLoading);
    console.log("isFetching:", isFetching);
    console.log("isError:", isError);
    console.log("error:", error);
    console.log("data:", data);
    console.log("status:", status);

    if (data) {
      console.log("Query successful, data:", data);
    }

    if (error) {
      console.error("Error in useDashboardData:", error);
    }
  }, [isLoading, isFetching, isError, error, data, status]);

  const handleAddProduct = () => {
    // Implement add product functionality
    console.log("Add product clicked");
  };

  const handleViewOrders = () => {
    // Implement view orders functionality
    console.log("View orders clicked");
  };

  const handleManageVendors = () => {
    // Implement manage vendors functionality
    console.log("Manage vendors clicked");
  };

  const generatePDFReport = () => {
    if (!data) {
      console.error("No data available for PDF report");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Admin Dashboard Report", 20, 20);
    doc.setFontSize(12);
    doc.text(
      `Total Sales: $${data.totalSales?.toLocaleString() ?? "N/A"}`,
      20,
      40
    );
    doc.text(`Total Orders: ${data.totalOrders ?? "N/A"}`, 20, 50);
    doc.text(`Active Users: ${data.activeUsers ?? "N/A"}`, 20, 60);
    doc.text(`Active Vendors: ${data.activeVendors ?? "N/A"}`, 20, 70);

    doc.text("Recent Orders:", 20, 90);
    data.recentOrders?.forEach((order, index) => {
      doc.text(
        `${order.user} - $${order.amount} - ${order.status}`,
        30,
        100 + index * 10
      );
    });

    doc.text("Sales Data:", 20, 150);
    data.salesData?.forEach((item, index) => {
      doc.text(`${item.name}: $${item.sales}`, 30, 160 + index * 10);
    });

    doc.save("admin_dashboard_report.pdf");
  };

  const generateExcelReport = () => {
    if (!data) {
      console.error("No data available for Excel report");
      return;
    }

    const ws = XLSX.utils.json_to_sheet([
      {
        "Total Sales": data.totalSales ?? "N/A",
        "Total Orders": data.totalOrders ?? "N/A",
        "Active Users": data.activeUsers ?? "N/A",
        "Active Vendors": data.activeVendors ?? "N/A",
      },
    ]);

    const salesWs = XLSX.utils.json_to_sheet(data.salesData ?? []);
    const ordersWs = XLSX.utils.json_to_sheet(data.recentOrders ?? []);
    const activitiesWs = XLSX.utils.json_to_sheet(data.recentActivities ?? []);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Overview");
    XLSX.utils.book_append_sheet(wb, salesWs, "Sales Data");
    XLSX.utils.book_append_sheet(wb, ordersWs, "Recent Orders");
    XLSX.utils.book_append_sheet(wb, activitiesWs, "Recent Activities");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, "admin_dashboard_report.xlsx");
  };

  const handleGenerateReport = () => {
    if (!data) {
      console.error("No data available for report generation");
      return;
    }

    try {
      setIsGeneratingReport(true);
      generatePDFReport();
      generateExcelReport();
    } catch (err) {
      console.error("Error generating reports:", err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  if (isLoading || isFetching) {
    console.log("Rendering loading state");
    return (
      <LoadingOverlay>
        <Paragraph color="white">Loading dashboard data...</Paragraph>
      </LoadingOverlay>
    );
  }

  if (isError) {
    console.log("Rendering error state");
    return (
      <DashboardWrapper>
        <Paragraph color="error.main">
          Error loading dashboard data: {error?.message || "Unknown error"}
        </Paragraph>
      </DashboardWrapper>
    );
  }

  if (!data) {
    console.log("Rendering no data state");
    return (
      <DashboardWrapper>
        <Paragraph>No dashboard data available</Paragraph>
      </DashboardWrapper>
    );
  }
  console.log("Rendering dashboard with data");
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
          value={`$${data.totalSales.toLocaleString()}`}
          icon="sales"
          trend={{ value: 0, isPositive: true }}
        />
        <KPICard
          title="Total Orders"
          value={data.totalOrders.toString()}
          icon="order"
          trend={{ value: 0, isPositive: true }}
        />
        <KPICard
          title="Active Users"
          value={data.activeUsers.toString()}
          icon="buyer"
          trend={{ value: 0, isPositive: true }}
        />
        <KPICard
          title="Active Vendors"
          value={data.activeVendors.toString()}
          icon="sellers"
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
