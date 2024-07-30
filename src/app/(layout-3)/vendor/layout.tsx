import { PropsWithChildren } from "react";
// GLOBAL CUSTOM COMPONENTS
import VendorDashboardLayout from "@component/layout/vendor-dashboard";
import Providers from "@utils/providers";

export default function Layout({ children }: PropsWithChildren) {
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
