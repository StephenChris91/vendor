import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Select, { SelectOption } from "@component/Select";

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
  const [selectedAction, setSelectedAction] = useState<SelectOption | null>(
    null
  );

  const handleActionChange = (option: SelectOption | null) => {
    setSelectedAction(option);
  };

  const handleApplyAction = () => {
    if (selectedAction) {
      onAction(selectedAction.value);
      setSelectedAction(null); // Reset the action after applying
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
            options={[
              { label: "Delete", value: "delete" },
              { label: "Activate", value: "activate" },
              { label: "Deactivate", value: "deactivate" },
            ]}
          />
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
