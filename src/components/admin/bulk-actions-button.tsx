// components/admin/BulkActions.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Select from "@component/Select";

const BulkActionBox = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ResponsiveFlexBox = styled(FlexBox)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface BulkActionsProps {
  selectedCount: number;
  onAction: (action: string) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onAction,
}) => {
  const [selectedAction, setSelectedAction] = useState("");

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAction(e.target.value);
  };

  const handleApplyAction = () => {
    if (selectedAction) {
      onAction(selectedAction);
      setSelectedAction(""); // Reset the action after applying
    }
  };

  return (
    <BulkActionBox>
      <ResponsiveFlexBox alignItems="center" justifyContent="space-between">
        <Box mb={{ xs: 2, sm: 0 }}>
          {selectedCount} product{selectedCount !== 1 ? "s" : ""} selected
        </Box>
        <ResponsiveFlexBox alignItems="center">
          <Select
            value={selectedAction}
            onChange={handleActionChange}
            placeholder="Choose action"
            mr={{ xs: 0, sm: 2 }}
            mb={{ xs: 2, sm: 0 }}
          >
            <option value="">Choose action</option>
            <option value="delete">Delete</option>
            <option value="activate">Activate</option>
            <option value="deactivate">Deactivate</option>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyAction}
            disabled={!selectedAction || selectedCount === 0}
          >
            Apply to selected
          </Button>
        </ResponsiveFlexBox>
      </ResponsiveFlexBox>
    </BulkActionBox>
  );
};

export default BulkActions;
