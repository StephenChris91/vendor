// components/admin/settings/SecuritySettings.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5, Paragraph } from "@component/Typography";
import Checkbox from "@component/CheckBox";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";
import Select from "@component/Select";

const SettingsSection = styled(Box)`
  margin-bottom: 2rem;
`;

const SecuritySettings: React.FC = () => {
  return (
    <Box>
      <H5 mb={3}>Security Settings</H5>

      <SettingsSection>
        <H5 mb={2}>Authentication</H5>
        <Checkbox label="Enable Two-Factor Authentication" mb={2} />
        <Select
          label="Two-Factor Authentication Method"
          placeholder="Select 2FA method"
          options={[
            { value: "email", label: "Email" },
            { value: "sms", label: "SMS" },
            { value: "app", label: "Authenticator App" },
          ]}
          mb={2}
        />
        <Checkbox label="Enforce Strong Passwords" mb={2} />
        <TextField
          label="Minimum Password Length"
          type="number"
          placeholder="Enter minimum length"
          fullwidth
          mb={2}
        />
      </SettingsSection>

      <SettingsSection>
        <H5 mb={2}>Login Security</H5>
        <TextField
          label="Maximum Login Attempts"
          type="number"
          placeholder="Enter maximum attempts"
          fullwidth
          mb={2}
        />
        <TextField
          label="Login Lockout Duration (minutes)"
          type="number"
          placeholder="Enter lockout duration"
          fullwidth
          mb={2}
        />
        <TextField
          label="Session Timeout (minutes)"
          type="number"
          placeholder="Enter session timeout"
          fullwidth
          mb={2}
        />
      </SettingsSection>

      <SettingsSection>
        <H5 mb={2}>IP Whitelisting</H5>
        <Checkbox label="Enable IP Whitelisting" mb={2} />
        <TextField
          label="Whitelisted IP Addresses"
          placeholder="Enter IP addresses (comma-separated)"
          fullwidth
          mb={2}
        />
        <Paragraph fontSize="12px" color="text.muted" mb={2}>
          Enter IP addresses that are allowed to access the admin panel. Leave
          empty to allow all IPs.
        </Paragraph>
      </SettingsSection>

      <SettingsSection>
        <H5 mb={2}>SSL/HTTPS</H5>
        <Checkbox label="Force SSL/HTTPS" mb={2} />
        <Paragraph fontSize="12px" color="text.muted" mb={2}>
          Enforce SSL/HTTPS for all connections to improve security.
        </Paragraph>
      </SettingsSection>

      <SettingsSection>
        <H5 mb={2}>Admin Activity Logging</H5>
        <Checkbox label="Enable Admin Activity Logging" mb={2} />
        <TextField
          label="Log Retention Period (days)"
          type="number"
          placeholder="Enter retention period"
          fullwidth
          mb={2}
        />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="outlined" color="primary" mr={2}>
          Reset to Defaults
        </Button>
        <Button variant="contained" color="primary">
          Save Security Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default SecuritySettings;
