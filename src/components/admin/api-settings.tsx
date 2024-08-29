// components/admin/settings/APISettings.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5, Paragraph } from "@component/Typography";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";

const SettingsSection = styled(Box)`
  margin-bottom: 2rem;
`;

interface APISettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const APISettings: React.FC<APISettingsProps> = ({ setHasUnsavedChanges }) => {
  return (
    <Box>
      <H5 mb={3}>API Settings</H5>

      <SettingsSection>
        <TextField
          label="API Key"
          value="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          fullwidth
          mb={2}
          disabled
        />
        <Paragraph mb={2}>
          Use this API key to authenticate requests to the API.
        </Paragraph>
        <Button variant="outlined" color="primary" mb={3}>
          Generate New API Key
        </Button>

        <H5 mb={2}>Webhook URL</H5>
        <TextField
          label="Webhook URL"
          placeholder="Enter webhook URL"
          fullwidth
          mb={2}
        />
        <Paragraph mb={2}>
          Enter the URL where you want to receive webhook notifications.
        </Paragraph>
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save API Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default APISettings;
