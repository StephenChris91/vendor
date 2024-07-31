// components/admin/ProductStatistics.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H4, H6 } from "@component/Typography";
import Icon from "@component/icon/Icon";

import { FilterBox, StatBox, StatItem, LoadingText } from "./styles";

interface ProductStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
}

interface ProductStatisticsProps {
  stats: ProductStats;
}

const ProductStatistics: React.FC<ProductStatisticsProps> = ({ stats }) => {
  return (
    <StatBox>
      <H4 mb={2}>Product Statistics</H4>
      <FlexBox flexWrap="wrap" justifyContent="space-between">
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
            package
          </Icon>
          <Box>
            <H6 color="text.muted">Total Products</H6>
            <H4>{stats.totalProducts}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="error" mr={1}>
            alert-triangle
          </Icon>
          <Box>
            <H6 color="text.muted">Out of Stock</H6>
            <H4>{stats.outOfStock}</H4>
          </Box>
        </StatItem>
        <StatItem>
          <Icon size="40px" color="primary" mr={1}>
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
