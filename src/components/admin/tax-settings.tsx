// components/admin/settings/TaxSettings.tsx
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

const TaxSettings: React.FC = () => {
  return (
    <Box>
      <H5 mb={3}>Tax Settings</H5>

      <SettingsSection>
        <Checkbox label="Enable Tax Calculation" mb={2} />
        <TextField
          label="Default Tax Rate (%)"
          type="number"
          placeholder="Enter default tax rate"
          fullwidth
          mb={2}
        />
        <Checkbox label="Apply Tax to Shipping" mb={2} />
        <TextField
          label="Tax Calculation Based On"
          placeholder="E.g., Billing Address, Shipping Address"
          fullwidth
          mb={2}
        />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Tax Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default TaxSettings;
