import { PropsWithChildren } from "react";
import FlexBox from "@component/FlexBox";
import AdminHeader from "@component/admin/adminHeader";
import { useCurrentUser } from "@lib/use-session-server";
import AdminSidebar from "@component/admin/adminSidebar";

export default async function Layout({ children }: PropsWithChildren) {
  const currentUser = await useCurrentUser();
  return (
    <FlexBox
      minHeight="100vh"
      alignItems="center"
      flexDirection="column"
      justifyContent="center"
    >
      <AdminHeader user={currentUser} />
      <AdminSidebar />
      {children}
    </FlexBox>
  );
}
