// components/admin/settings/PaymentSettings.tsx
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

const PaymentSettings: React.FC = () => {
  return (
    <Box>
      <H5 mb={3}>Payment Settings</H5>

      <SettingsSection>
        <H5 mb={2}>PayPal</H5>
        <TextField
          label="PayPal Client ID"
          placeholder="Enter PayPal Client ID"
          fullwidth
          mb={2}
        />
        <TextField
          label="PayPal Secret"
          type="password"
          placeholder="Enter PayPal Secret"
          fullwidth
          mb={2}
        />
        <Checkbox label="Enable PayPal" mb={2} />

        <H5 mb={2}>Stripe</H5>
        <TextField
          label="Stripe Public Key"
          placeholder="Enter Stripe Public Key"
          fullwidth
          mb={2}
        />
        <TextField
          label="Stripe Secret Key"
          type="password"
          placeholder="Enter Stripe Secret Key"
          fullwidth
          mb={2}
        />
        <Checkbox label="Enable Stripe" mb={2} />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Payment Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default PaymentSettings;
