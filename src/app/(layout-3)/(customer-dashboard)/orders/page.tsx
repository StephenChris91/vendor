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
import { getOrders } from "actions/orders/getOrders";

type OrdersResponse = { orders: Order[] } | { error: string };

export default function OrderList() {
  const { data, isLoading, error } = useQuery<OrdersResponse, Error>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    return <div>An error occurred: {error.message}</div>;
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
        <OrderRow order={item} key={item.id} />
      ))}

      <OrdersPagination orderList={orderList} />
    </Fragment>
  );
}
