import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";




export const DashboardWrapper = styled(Box)`
  padding: 2rem;
`;

export const KPIWrapper = styled(FlexBox)`
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const ChartWrapper = styled(FlexBox)`
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const SideSection = styled(FlexBox)`
  gap: 1.5rem;
  flex-direction: column;
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;