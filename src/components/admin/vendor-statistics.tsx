// components/admin/VendorStatistics.tsx
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
`;

interface VendorStatisticsProps {
  totalVendors: number;
  newVendors: number;
  averageRating: number;
  pendingApprovals: number;
}

const VendorStatistics: React.FC<VendorStatisticsProps> = ({
  totalVendors,
  newVendors,
  averageRating,
  pendingApprovals,
}) => {
  return (
    <StatBox>
      <H4 mb={2}>Vendor Statistics</H4>
      <FlexBox flexWrap="wrap" justifyContent="space-between">
        <StatItem>
          <Icon size="40px" color="primary.main" mr={1}>
            store
          </Icon>
          <Box>
            <H6 color="text.muted">Total Vendors</H6>
            <H4>{totalVendors}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="success.main" mr={1}>
            trending-up
          </Icon>
          <Box>
            <H6 color="text.muted">New Vendors (This Month)</H6>
            <H4>{newVendors}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="warning.main" mr={1}>
            star
          </Icon>
          <Box>
            <H6 color="text.muted">Average Vendor Rating</H6>
            <H4>{averageRating.toFixed(1)}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="error.main" mr={1}>
            alert-circle
          </Icon>
          <Box>
            <H6 color="text.muted">Pending Approvals</H6>
            <H4>{pendingApprovals}</H4>
          </Box>
        </StatItem>
      </FlexBox>
    </StatBox>
  );
};

export default VendorStatistics;
