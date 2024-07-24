"use client";

// components/admin/AdminHeader.tsx
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5, Small } from "@component/Typography";
import { Button } from "@component/buttons";
import { LogoutButton } from "@component/logout-button";
import { useCurrentUser } from "@lib/use-session-client";

// type AdminUser = {
//   name?: string | null;
//   email?: string | null;
// };

// type AdminHeaderProps = {
//   user: AdminUser;
// };

export default function AdminHeader() {
  const user = useCurrentUser();

  return (
    <Box padding="1rem" backgroundColor="white">
      <FlexBox justifyContent="space-between" alignItems="center">
        <H5>Welcome, {user?.firstname || "Admin"}</H5>
        <FlexBox alignItems="center">
          <Small mr="1rem">{user?.email || "No email provided"}</Small>
          <LogoutButton>Logout</LogoutButton>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}
