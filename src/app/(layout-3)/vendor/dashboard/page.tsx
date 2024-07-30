import { Fragment } from "react";
// API FUNCTIONS
import api from "@utils/__api__/dashboard";
// GLOBAL CUSTOM COMPONENTS
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import DashboardContent from "@sections/vendor-dashboard/dashboard";
import { useCurrentSession } from "@lib/use-session-server";

export default async function VendorDashboard() {
  const session = await useCurrentSession();
  const sales = await api.getSales();
  const summeryCards = await api.getSummeryCards();
  const countrySales = await api.getCountryBasedSales();

  // if (session?.user?.shopStatus == "Pending") {
  //   return (
  //     <div>Your shop is still pending approval. Please wait for approval.</div>
  //   );
  // }

  return (
    <Fragment>
      <DashboardPageHeader title="Dashboard" iconName="bag_filled" />
      {/* {session.user?.shopStatus == "Pending" ? (
        "Pending"
      ) : (
      )} */}
      <DashboardContent
        sales={sales}
        summeryCards={summeryCards}
        countrySales={countrySales}
      />
    </Fragment>
  );
}
