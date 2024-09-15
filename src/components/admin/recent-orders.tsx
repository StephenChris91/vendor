// src/components/admin/recent-orders.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H4, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import { currency } from "@utils/utils";

const OrderCard = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const OrderItem = styled(FlexBox)`
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[300]};
  padding: 0.75rem 0;
  &:last-child {
    border-bottom: none;
  }
`;

interface Order {
  id: string;
  user: string;
  amount: number;
  status: string;
}

interface RecentOrdersProps {
  orders?: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <OrderCard>
        <H4 mb="1.5rem">Recent Orders</H4>
        <Paragraph>No recent orders available.</Paragraph>
      </OrderCard>
    );
  }

  return (
    <OrderCard>
      <H4 mb="1.5rem">Recent Orders</H4>
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          justifyContent="space-between"
          alignItems="center"
        >
          <Paragraph>{order.user}</Paragraph>
          <Paragraph fontWeight="600">{currency(order.amount)}</Paragraph>
          <Paragraph
            color={
              order.status === "Completed"
                ? "success.main"
                : order.status === "Pending"
                ? "warning.main"
                : "info.main"
            }
          >
            {order.status}
          </Paragraph>
        </OrderItem>
      ))}
      <Button variant="outlined" color="primary" fullwidth mt="1.5rem">
        View All Orders
      </Button>
    </OrderCard>
  );
};

export default RecentOrders;
