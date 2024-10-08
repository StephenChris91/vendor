"use client";

import { Fragment } from "react";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import OrderRow from "@sections/customer-dashboard/orders/OrderRow";
import { Order } from "@models/order.model";

type Props = {
  orders: Order[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
};

export default function OrderList({ orders, meta, onPageChange }: Props) {
  const handlePageChange = (data: { selected: number }) => {
    onPageChange(data.selected + 1);
  };

  return (
    <Fragment>
      {orders.map((item) => (
        <OrderRow order={item} key={item.id} />
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={meta.totalPages}
          initialPage={meta.page - 1}
          onChange={handlePageChange}
        />
      </FlexBox>
    </Fragment>
  );
}
