"use client";

// components/admin/AdminHeader.tsx
import { useRouter } from "next/navigation";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5, Small } from "@component/Typography";
import { Button } from "@component/buttons";
import { signOut } from "auth";

type AdminUser = {
  name?: string | null;
  email?: string | null;
};

type AdminHeaderProps = {
  user: AdminUser;
};

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  return (
    <Box padding="1rem" backgroundColor="white">
      <FlexBox justifyContent="space-between" alignItems="center">
        <H5>Welcome, {user.name || "Admin"}</H5>
        <FlexBox alignItems="center">
          <Small mr="1rem">{user.email || "No email provided"}</Small>
          <Button variant="outlined" color="primary" onClick={handleSignOut}>
            Logout
          </Button>
        </FlexBox>
      </FlexBox>
    </Box>
  );
}
