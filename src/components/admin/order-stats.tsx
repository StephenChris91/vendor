// components/admin/OrderStatistics.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H4, H6 } from "@component/Typography";
import Icon from "@component/icon/Icon";

const StatBox = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const StatItem = styled(FlexBox)`
  align-items: center;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

interface OrderStatisticsProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
}

const OrderStatistics: React.FC<OrderStatisticsProps> = ({ stats }) => {
  return (
    <StatBox>
      <H4 mb={2}>Order Statistics</H4>
      <FlexBox flexWrap="wrap" justifyContent="space-between">
        <StatItem>
          <Icon size="40px" color="primary.main" mr={1}>
            shopping-bag
          </Icon>
          <Box>
            <H6 color="text.muted">Total Orders</H6>
            <H4>{stats.totalOrders}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="warning.main" mr={1}>
            clock
          </Icon>
          <Box>
            <H6 color="text.muted">Pending Orders</H6>
            <H4>{stats.pendingOrders}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="success.main" mr={1}>
            dollar-sign
          </Icon>
          <Box>
            <H6 color="text.muted">Total Revenue</H6>
            <H4>${stats.totalRevenue.toLocaleString()}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="info.main" mr={1}>
            trending-up
          </Icon>
          <Box>
            <H6 color="text.muted">Average Order Value</H6>
            <H4>${stats.averageOrderValue.toLocaleString()}</H4>
          </Box>
        </StatItem>
      </FlexBox>
    </StatBox>
  );
};

export default OrderStatistics;
