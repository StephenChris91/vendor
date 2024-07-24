// components/admin/ProductStatistics.tsx
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

interface ProductStatisticsProps {
  stats: {
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
  };
}

const ProductStatistics: React.FC<ProductStatisticsProps> = ({ stats }) => {
  return (
    <StatBox>
      <H4 mb={2}>Product Statistics</H4>
      <FlexBox flexWrap="wrap" justifyContent="space-between">
        <StatItem>
          <Icon size="40px" color="primary.main" mr={1}>
            package
          </Icon>
          <Box>
            <H6 color="text.muted">Total Products</H6>
            <H4>{stats.totalProducts}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="error.main" mr={1}>
            alert-triangle
          </Icon>
          <Box>
            <H6 color="text.muted">Out of Stock</H6>
            <H4>{stats.outOfStock}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="warning.main" mr={1}>
            alert-circle
          </Icon>
          <Box>
            <H6 color="text.muted">Low Stock</H6>
            <H4>{stats.lowStock}</H4>
          </Box>
        </StatItem>
      </FlexBox>
    </StatBox>
  );
};

export default ProductStatistics;
