import { PropsWithChildren } from "react";
// GLOBAL CUSTOM COMPONENTS
import VendorDashboardLayout from "@component/layout/vendor-dashboard";
import Providers from "@utils/providers";
import { useCurrentSession } from "@lib/use-session-server";
import Typography from "@component/Typography";
import Link from "next/link";
import { Button } from "@component/buttons";
import FlexBox from "@component/FlexBox";
export default async function Layout({ children }: PropsWithChildren) {
  const session = await useCurrentSession();

  if (!session || !session.user || session.user.role !== "Vendor") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#F7F7F7",
          color: "#333",
          fontFamily: "Poppins, sans-serif",
          fontSize: "1.6rem",
        }}
      >
        <Typography>Please log in to access the vendor dashboard.</Typography>
        <Link href="/">
          <Button variant="outlined" color="primary" m="0.5rem">
            Go Back
          </Button>
        </Link>
      </div>
    );
  }
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
