// components/admin/settings/GeneralSettings.tsx
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

interface GeneralSettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  setHasUnsavedChanges,
}) => {
  return (
    <Box>
      <H5 mb={3}>General Settings</H5>

      <SettingsSection>
        <TextField
          label="Site Name"
          placeholder="Enter site name"
          fullwidth
          mb={2}
        />
        <TextField
          label="Site Logo URL"
          placeholder="Enter logo URL"
          fullwidth
          mb={2}
        />
        <Select
          label="Default Currency"
          placeholder="Select default currency"
          options={[
            { value: "usd", label: "USD" },
            { value: "eur", label: "EUR" },
            { value: "gbp", label: "GBP" },
          ]}
          mb={2}
        />
        <Select
          label="Time Zone"
          placeholder="Select time zone"
          options={[
            { value: "utc", label: "UTC" },
            { value: "est", label: "EST" },
            { value: "pst", label: "PST" },
          ]}
          mb={2}
        />
        <Select
          label="Default Language"
          placeholder="Select default language"
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" },
          ]}
          mb={2}
        />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save General Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default GeneralSettings;
