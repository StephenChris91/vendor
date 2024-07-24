// components/admin/settings/CommissionSettings.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import TextField from "@component/text-field";
import Select from "@component/Select";
import { Button } from "@component/buttons";

const SettingsSection = styled(Box)`
  margin-bottom: 2rem;
`;

const CommissionSettings: React.FC = () => {
  return (
    <Box>
      <H5 mb={3}>Commission Settings</H5>

      <SettingsSection>
        <TextField
          label="Default Commission Rate (%)"
          type="number"
          placeholder="Enter default commission rate"
          fullwidth
          mb={2}
        />
        <Select
          label="Commission Payout Schedule"
          placeholder="Select payout schedule"
          options={[
            { value: "weekly", label: "Weekly" },
            { value: "biweekly", label: "Bi-weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
          mb={2}
        />
        <TextField
          label="Minimum Payout Amount"
          type="number"
          placeholder="Enter minimum payout amount"
          fullwidth
          mb={2}
        />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Commission Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default CommissionSettings;
