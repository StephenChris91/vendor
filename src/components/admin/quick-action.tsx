// components/admin/QuickActionButtons.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H4 } from "@component/Typography";
import { Button } from "@component/buttons";
import Icon from "@component/icon/Icon";

const ActionCard = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const ActionButton = styled(Button)`
  margin-bottom: 1rem;
  justify-content: flex-start;
  padding: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

interface QuickActionButtonsProps {
  onAddProduct: () => void;
  onViewOrders: () => void;
  onManageVendors: () => void;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onAddProduct,
  onViewOrders,
  onManageVendors,
}) => {
  return (
    <ActionCard>
      <H4 mb="1.5rem">Quick Actions</H4>
      <FlexBox flexDirection="column">
        <ActionButton variant="outlined" color="primary" onClick={onAddProduct}>
          <Icon size="20px" mr="0.5rem">
            plus-circle
          </Icon>
          Add New Product
        </ActionButton>
        <ActionButton variant="outlined" color="primary" onClick={onViewOrders}>
          <Icon size="20px" mr="0.5rem">
            shopping-cart
          </Icon>
          View All Orders
        </ActionButton>
        <ActionButton
          variant="outlined"
          color="primary"
          onClick={onManageVendors}
        >
          <Icon size="20px" mr="0.5rem">
            users
          </Icon>
          Manage Vendors
        </ActionButton>
      </FlexBox>
    </ActionCard>
  );
};

export default QuickActionButtons;
