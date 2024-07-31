// components/admin/CustomerStatistics.tsx
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

const LoadingText = styled.span`
  color: ${(props) => props.theme.colors.text.muted};
  font-style: italic;
`;

interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  averageSpend: number;
}

interface CustomerStatisticsProps {
  stats: CustomerStats | null;
  isLoading: boolean;
}

const CustomerStatistics: React.FC<CustomerStatisticsProps> = ({
  stats,
  isLoading,
}) => {
  if (!stats) {
    return <StatBox>Error loading customer statistics.</StatBox>;
  }

  return (
    <StatBox>
      <H4 mb={2}>Customer Statistics</H4>
      <FlexBox flexWrap="wrap" justifyContent="space-between">
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            users
          </Icon>
          <Box>
            <H6 color="text.muted">Total Customers</H6>
            {isLoading ? (
              <LoadingText>Loading...</LoadingText>
            ) : (
              <H4>{stats.totalCustomers}</H4>
            )}
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            user-plus
          </Icon>
          <Box>
            <H6 color="text.muted">New Customers (Last 30 days)</H6>
            {isLoading ? (
              <LoadingText>Loading...</LoadingText>
            ) : (
              <H4>{stats.newCustomers}</H4>
            )}
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            dollar-sign
          </Icon>
          <Box>
            <H6 color="text.muted">Average Spend</H6>
            {isLoading ? (
              <LoadingText>Loading...</LoadingText>
            ) : (
              <H4>${stats.averageSpend.toFixed(2)}</H4>
            )}
          </Box>
        </StatItem>
      </FlexBox>
    </StatBox>
  );
};

export default CustomerStatistics;
