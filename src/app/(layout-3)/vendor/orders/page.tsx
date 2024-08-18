"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
import Hidden from "@component/hidden";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import OrderList from "@sections/vendor-dashboard/orders/OrderList";
import Spinner from "@component/Spinner";
import { Order } from "@models/order.model";

interface OrdersResponse {
  orders: Order[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

const fetchVendorOrders = async (
  page = 1,
  pageSize = 10
): Promise<OrdersResponse> => {
  const { data } = await axios.get<OrdersResponse>(
    `/api/products/vendor/get-orders`,
    {
      params: { page, pageSize },
    }
  );
  return data;
};

export default function Orders() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useQuery<OrdersResponse, Error>({
    queryKey: ["vendorOrders", page],
    queryFn: () => fetchVendorOrders(page),
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading orders: {error.message}</div>;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <Fragment>
      <DashboardPageHeader title="Orders" iconName="bag_filled" />

      <Hidden down={769}>
        <TableRow
          padding="0px 18px"
          boxShadow="none"
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

      {data && (
        <OrderList
          orders={data.orders}
          meta={data.meta}
          onPageChange={handlePageChange}
        />
      )}
    </Fragment>
  );
}
