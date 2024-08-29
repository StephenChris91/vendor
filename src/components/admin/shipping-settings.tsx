// components/admin/settings/ShippingSettings.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import TextField from "@component/text-field";
import Checkbox from "@component/CheckBox";
import { Button } from "@component/buttons";

const SettingsSection = styled(Box)`
  margin-bottom: 2rem;
`;

interface ShippingSettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const ShippingSettings: React.FC<ShippingSettingsProps> = ({
  setHasUnsavedChanges,
}) => {
  return (
    <Box>
      <H5 mb={3}>Shipping Settings</H5>

      <SettingsSection>
        <Checkbox label="Enable Free Shipping" mb={2} />
        <TextField
          label="Free Shipping Minimum Order Amount"
          type="number"
          placeholder="Enter minimum amount"
          fullwidth
          mb={2}
        />
        <TextField
          label="Flat Rate Shipping Cost"
          type="number"
          placeholder="Enter flat rate cost"
          fullwidth
          mb={2}
        />
        <Checkbox label="Enable Local Pickup" mb={2} />
        <TextField
          label="Local Pickup Fee"
          type="number"
          placeholder="Enter local pickup fee"
          fullwidth
          mb={2}
        />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Shipping Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default ShippingSettings;
