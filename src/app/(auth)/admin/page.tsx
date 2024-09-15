import { H1 } from "@component/Typography";
import Flexbox from "@component/FlexBox";
import React from "react";
import AdminDashboard from "@component/admin/dashboard/adminDashboard";

interface pageProps {}

const page: React.FC<pageProps> = () => {
  return <AdminDashboard />;
};

export default page;
