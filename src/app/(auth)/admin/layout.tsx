"use client";
import AdminDashboardLayout from "@component/layout/admin-dashboard/Layout";
import { useCurrentUser } from "@lib/use-session-client";
import { PropsWithChildren } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
// GLOBAL CUSTOM COMPONENTS

export default function Layout({ children }: PropsWithChildren) {
  const user = useCurrentUser();
  const router = useRouter();
  if (!user) {
    toast.error("Please log in to access this page");
    router.push("/login");
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
