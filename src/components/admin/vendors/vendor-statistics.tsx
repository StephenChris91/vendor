import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H4, H6 } from "@component/Typography";
import Icon from "@component/icon/Icon";
import { StatBox, StatItem } from "./styles";

interface VendorStatisticsProps {
  totalVendors: number;
  newVendors: number;
  averageRating: number;
  pendingApprovals: number;
  displayedVendors?: any[]; // Add this line
}

const VendorStatistics: React.FC<VendorStatisticsProps> = ({
  totalVendors = 0,
  newVendors = 0,
  averageRating = 0,
  pendingApprovals = 0,
  displayedVendors = [], // Initialize displayedVendors as an empty array by default
}) => {
  return (
    <StatBox>
      <H4 mb={2}>Vendor Statistics</H4>
      <FlexBox flexWrap="wrap" justifyContent="space-between">
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            store
          </Icon>
          <Box>
            <H6 color="text.muted">Total Vendors</H6>
            <H4>{totalVendors}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            trending-up
          </Icon>
          <Box>
            <H6 color="text.muted">New Vendors (This Month)</H6>
            <H4>{newVendors}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            star
          </Icon>
          <Box>
            <H6 color="text.muted">Average Vendor Rating</H6>
            <H4>{averageRating.toFixed(2)}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="error" mr={1}>
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
