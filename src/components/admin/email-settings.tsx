// components/admin/settings/EmailSettings.tsx
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

interface EmailSettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({
  setHasUnsavedChanges,
}) => {
  return (
    <Box>
      <H5 mb={3}>Email Settings</H5>

      <SettingsSection>
        <TextField
          label="SMTP Host"
          placeholder="Enter SMTP host"
          fullwidth
          mb={2}
        />
        <TextField
          label="SMTP Port"
          placeholder="Enter SMTP port"
          fullwidth
          mb={2}
        />
        <TextField
          label="SMTP Username"
          placeholder="Enter SMTP username"
          fullwidth
          mb={2}
        />
        <TextField
          label="SMTP Password"
          type="password"
          placeholder="Enter SMTP password"
          fullwidth
          mb={2}
        />
        <Select
          label="Encryption Type"
          placeholder="Select encryption type"
          options={[
            { value: "tls", label: "TLS" },
            { value: "ssl", label: "SSL" },
          ]}
          mb={2}
        />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Email Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default EmailSettings;
