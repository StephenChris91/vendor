// components/admin/KPICard.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3, H6 } from "@component/Typography";
import Icon from "@component/icon/Icon";

const StyledCard = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.primary[100]};
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend }) => {
  return (
    <StyledCard>
      <FlexBox alignItems="center">
        <IconWrapper>
          <Icon size="28px" color="primary">
            {icon}
          </Icon>
        </IconWrapper>
        <Box>
          <H6 color="text.muted" mb="0.5rem">
            {title}
          </H6>
          <H3>{value}</H3>
          {trend && (
            <FlexBox alignItems="center" mt="0.5rem">
              <Icon size="16px" color={trend.isPositive ? "primary" : "error"}>
                {trend.isPositive ? "arrow-up" : "arrow-down"}
              </Icon>
              <H6
                color={trend.isPositive ? "success.main" : "error.main"}
                ml="0.25rem"
              >
                {trend.value}%
              </H6>
            </FlexBox>
          )}
        </Box>
      </FlexBox>
    </StyledCard>
  );
};

export default KPICard;
