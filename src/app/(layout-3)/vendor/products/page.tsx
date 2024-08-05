"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "@lib/axios";
// GLOBAL CUSTOM COMPONENTS
import Hidden from "@component/hidden";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import { H5 } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
// PAGE SECTION COMPONENTS
import { ProductList } from "@sections/vendor-dashboard/products";
import { useCurrentUser } from "@lib/use-session-client";

// API function to fetch products
const fetchVendorProducts = async ({ queryKey }) => {
  const [_key, { id: vendorId, page, pageSize }] = queryKey;
  const { data } = await axios.get("/api/products/vendor", {
    params: { vendorId, page, pageSize },
  });
  return data;
};

export default function VendorProducts({
  params,
}: {
  params: { page: string };
}) {
  // Implement this function based on your auth system
  const page = params.page ? parseInt(params.page) : 1;
  const pageSize = 10;

  const user = useCurrentUser();
  const vendorId = user?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: ["vendorProducts", { vendorId, page, pageSize }],
    queryFn: fetchVendorProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <Fragment>
      <DashboardPageHeader title="Products" iconName="delivery-box" />

      <Hidden down={769}>
        <TableRow
          padding="0px 18px"
          mb="-0.125rem"
          boxShadow="none"
          backgroundColor="transparent"
        >
          <FlexBox my="0px" mx="6px" flex="2 2 220px !important">
            <H5 ml="56px" color="text.muted" textAlign="left">
              Name
            </H5>
          </FlexBox>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Regular price
          </H5>

          <H5 color="text.muted" my="0px" mx="6px" textAlign="left">
            Sale Price
          </H5>

          <H5 flex="0 0 0 !important" color="text.muted" px="22px" my="0px" />
        </TableRow>
      </Hidden>

      <ProductList products={data.result} meta={data.meta} />
    </Fragment>
  );
}
