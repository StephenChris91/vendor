"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import DashboardContent from "@sections/vendor-dashboard/dashboard";
import Spinner from "@component/Spinner";

const getSummeryCards = async () => {
  const response = await axios.get("/api/vendors/dashboard/summary");
  return response.data;
};

const getCountryBasedSales = async () => {
  const response = await axios.get("/api/vendors/dashboard/top-states");
  return response.data;
};

const getSales = async () => {
  const response = await axios.get("/api/vendors/dashboard/sales");
  return response.data;
};

export default function VendorDashboard() {
  const { data: sales, isLoading: salesLoading } = useQuery({
    queryKey: ["sales"],
    queryFn: getSales,
  });

  const { data: summeryCards, isLoading: summeryLoading } = useQuery({
    queryKey: ["summery"],
    queryFn: getSummeryCards,
  });

  const { data: countrySales, isLoading: countrySalesLoading } = useQuery({
    queryKey: ["countrySales"],
    queryFn: getCountryBasedSales,
  });

  if (salesLoading || summeryLoading || countrySalesLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <DashboardPageHeader title="Dashboard" iconName="bag_filled" />

      <DashboardContent
        sales={sales}
        summeryCards={summeryCards}
        countrySales={countrySales}
      />
    </Fragment>
  );
}
