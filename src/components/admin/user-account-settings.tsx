// components/admin/settings/UserAccountSettings.tsx
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

interface UserAccountSettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAccountSettings: React.FC<UserAccountSettingsProps> = ({
  setHasUnsavedChanges,
}) => {
  return (
    <Box>
      <H5 mb={3}>User Account Settings</H5>

      <SettingsSection>
        <TextField
          label="Minimum Password Length"
          type="number"
          placeholder="Enter minimum length"
          fullwidth
          mb={2}
        />
        <Checkbox label="Require uppercase letters" mb={1} />
        <Checkbox label="Require numbers" mb={1} />
        <Checkbox label="Require special characters" mb={2} />
        <Checkbox label="Allow user registration" mb={1} />
        <Checkbox label="Require email verification" mb={2} />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save User Account Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default UserAccountSettings;
