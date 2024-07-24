// "use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import AdminDashboardLayout from "@component/layout/admin-dashboard/Layout";
import { PropsWithChildren } from "react";
// GLOBAL CUSTOM COMPONENTS

export default function Layout({ children }: PropsWithChildren) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
