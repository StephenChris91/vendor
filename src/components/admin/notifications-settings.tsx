// components/admin/settings/NotificationSettings.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import Checkbox from "@component/CheckBox";
import { Button } from "@component/buttons";

const SettingsSection = styled(Box)`
  margin-bottom: 2rem;
`;

interface NotificationSettingsProps {
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  setHasUnsavedChanges,
}) => {
  return (
    <Box>
      <H5 mb={3}>Notification Settings</H5>

      <SettingsSection>
        <H5 mb={2}>Admin Notifications</H5>
        <Checkbox label="New Order" mb={1} />
        <Checkbox label="New User Registration" mb={1} />
        <Checkbox label="New Vendor Application" mb={1} />
        <Checkbox label="Low Stock Alert" mb={2} />

        <H5 mb={2}>Vendor Notifications</H5>
        <Checkbox label="New Order" mb={1} />
        <Checkbox label="Order Status Change" mb={1} />
        <Checkbox label="Low Stock Alert" mb={1} />
        <Checkbox label="Commission Payout" mb={2} />
      </SettingsSection>

      <FlexBox justifyContent="flex-end">
        <Button variant="contained" color="primary">
          Save Notification Settings
        </Button>
      </FlexBox>
    </Box>
  );
};

export default NotificationSettings;
