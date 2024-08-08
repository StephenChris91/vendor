"use client";

import { Fragment } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { currency } from "@utils/utils";
import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Typography, { H5, H6, Paragraph } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {
  OrderStatus,
  WriteReview,
  OrderListButton,
} from "@sections/customer-dashboard/orders";
import { Order } from "@models/order.model";
import { getOrder } from "actions/orders/getOrder";

type OrderDetailsProps = {
  params: { id: string };
};

export default function OrderDetails({ params }: OrderDetailsProps) {
  const { data, isLoading, error } = useQuery<
    { order: Order } | { error: string },
    Error
  >({
    queryKey: ["order", params.id],
    queryFn: async () => getOrder(params.id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;
  if (!data || "error" in data) return <div>'Order not found'</div>;

  const { order } = data;

  return (
    <Fragment>
      <DashboardPageHeader
        title="Order Details"
        iconName="bag_filled"
        button={<OrderListButton />}
      />

      <OrderStatus status={order.status} />

      <Card p="0px" mb="30px" overflow="hidden" borderRadius={8}>
        <TableRow bg="gray.200" p="12px" boxShadow="none" borderRadius={0}>
          <FlexBox className="pre" m="6px" alignItems="center">
            <Typography fontSize="14px" color="text.muted" mr="4px">
              Order ID:
            </Typography>
            <Typography fontSize="14px">#{order.id.substring(0, 8)}</Typography>
          </FlexBox>
          <FlexBox className="pre" m="6px" alignItems="center">
            <Typography fontSize="14px" color="text.muted" mr="4px">
              Placed on:
            </Typography>
            <Typography fontSize="14px">
              {format(new Date(order.createdAt), "dd MMM, yyyy")}
            </Typography>
          </FlexBox>
          <FlexBox className="pre" m="6px" alignItems="center">
            <Typography fontSize="14px" color="text.muted" mr="4px">
              Status:
            </Typography>
            <Typography fontSize="14px">{order.status}</Typography>
          </FlexBox>
        </TableRow>

        <Box py="0.5rem">
          {order.orderItems.map((item) => (
            <WriteReview key={item.id} item={item} />
          ))}
        </Box>
      </Card>

      <Grid container spacing={6}>
        <Grid item lg={6} md={6} xs={12}>
          <Card p="20px 30px" borderRadius={8}>
            <H5 mt="0px" mb="14px">
              Order Information
            </H5>
            <Paragraph fontSize="14px" my="0px">
              Order Status: {order.status}
            </Paragraph>
            <Paragraph fontSize="14px" my="0px">
              Payment Method: {order.paymentMethod}
            </Paragraph>
            <Paragraph fontSize="14px" my="0px">
              Payment Reference: {order.paymentReference || "N/A"}
            </Paragraph>
          </Card>
        </Grid>
        <Grid item lg={6} md={6} xs={12}>
          <Card p="20px 30px" borderRadius={8}>
            <H5 mt="0px" mb="14px">
              Total Summary
            </H5>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="0.5rem"
            >
              <Typography fontSize="14px">Subtotal:</Typography>
              <H6 my="0px">{currency(order.subtotal)}</H6>
            </FlexBox>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="0.5rem"
            >
              <Typography fontSize="14px">Shipping:</Typography>
              <H6 my="0px">{currency(order.shippingCost)}</H6>
            </FlexBox>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="0.5rem"
            >
              <Typography fontSize="14px">Tax:</Typography>
              <H6 my="0px">{currency(order.tax)}</H6>
            </FlexBox>
            <Divider mb="0.5rem" />
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="1rem"
            >
              <H6 my="0px">Total</H6>
              <H6 my="0px">{currency(order.totalPrice)}</H6>
            </FlexBox>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
}
