// components/SkeletonGrid.tsx
import React from "react";
import styled from "styled-components";
import Skeleton from "./Skeleton";
import Grid from "@component/grid/Grid";

const SkeletonItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface SkeletonGridProps {
  count: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  height?: string;
  width?: string;
}

const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  count,
  xs = 12,
  sm = 6,
  md = 4,
  lg = 3,
  height = "200px",
  width = "100%",
}) => {
  return (
    <Grid container spacing={6}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item lg={lg} md={md} sm={sm} xs={xs} key={index}>
          <SkeletonItemWrapper>
            <Skeleton
              height={height}
              width={width}
              borderRadius="8px"
              margin="0 0 8px 0"
            />
            <Skeleton height="20px" width="70%" margin="0 0 8px 0" />
            <Skeleton height="16px" width="40%" />
          </SkeletonItemWrapper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonGrid;
