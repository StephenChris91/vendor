// app/admin/layout.tsx
"use client";

import { PropsWithChildren } from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";

import Box from "@component/Box";
import AdminHeader from "@component/admin/adminHeader";
import AdminSidebar from "@component/admin/adminSidebar";
import { useCurrentUser } from "@lib/use-session-client";

const LayoutWrapper = styled(Box)`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(Box)`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const ContentArea = styled(Box)`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
`;

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <LayoutWrapper>
      <AdminHeader user={user} />
      <MainContent>
        <AdminSidebar />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutWrapper>
  );
}
