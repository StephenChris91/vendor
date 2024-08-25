"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import Hidden from "@component/hidden";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {
  OrderRow,
  OrdersPagination,
} from "@sections/customer-dashboard/orders";
import { Order } from "@models/order.model";
import VendorOrderRow from "@sections/customer-dashboard/orders/vendorOrderRow";

type OrdersResponse = { orders: Order[] } | { error: string };

async function fetchCustomerOrders(): Promise<OrdersResponse> {
  const response = await fetch("/api/order/customer-order", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export default function OrderList() {
  const { data, isLoading, error } = useQuery<OrdersResponse, Error>({
    queryKey: ["orders"],
    queryFn: fetchCustomerOrders,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  if (!data) {
    return <div>An unknown error occurred. Please try again later.</div>;
  }

  if ("error" in data) {
    return <div>An error occurred: {data.error}</div>;
  }

  const orderList = data.orders;

  return (
    <Fragment>
      <DashboardPageHeader title="My Orders" iconName="bag_filled" />

      <Hidden down={769}>
        <TableRow
          boxShadow="none"
          padding="0px 18px"
          backgroundColor="transparent"
        >
          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Order #
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Status
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Date purchased
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Total
          </H5>

          <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px" />
        </TableRow>
      </Hidden>

      {orderList.map((item) => (
        <VendorOrderRow order={item} key={item.id} />
      ))}

      <OrdersPagination orderList={orderList} />
    </Fragment>
  );
}
