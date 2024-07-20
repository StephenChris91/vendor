// app/admin/layout.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "auth";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import AdminSidebar from "@component/admin/adminSidebar";
import AdminHeader from "@component/admin/adminHeader";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "Admin") {
    redirect("/admin/login");
  }

  return (
    <FlexBox height="100vh" width="100%">
      <AdminSidebar />
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        <AdminHeader user={session.user} />
        <Box
          flex={1}
          overflow="auto"
          backgroundColor="body.paper"
          padding="2rem"
        >
          {children}
        </Box>
      </Box>
    </FlexBox>
  );
}
