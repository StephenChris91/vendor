// "use client";
import AdminDashboardLayout from "@component/layout/admin-dashboard/Layout";
import { PropsWithChildren } from "react";
// GLOBAL CUSTOM COMPONENTS

export default function Layout({ children }: PropsWithChildren) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
