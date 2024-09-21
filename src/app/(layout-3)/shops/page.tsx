"use client";

import { Fragment, useEffect } from "react";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import ShopCard1 from "@sections/shop/ShopCard1";
import { H2, SemiSpan } from "@component/Typography";
import { useShopList } from "@utils/__api__/shops";
import SkeletonGrid from "@component/skeleton/SkeletonProducts";

export default function ShopList() {
  const { data: shopListData, isLoading, error, refetch } = useShopList();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000); // Refetch every minute

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <SkeletonGrid count={9} />;
  if (error) {
    console.error("Error in ShopList:", error);
    return <div>Error loading shops. Please try again later.</div>;
  }
  if (
    !shopListData ||
    !Array.isArray(shopListData) ||
    shopListData.length === 0
  ) {
    return <div>No approved shops found. Check back later!</div>;
  }

  return (
    <Fragment>
      <H2 mb="24px">All Shops</H2>

      <Grid container spacing={6}>
        {shopListData.map((item) => {
          console.log("Shop item:", item);
          return (
            <Grid item lg={4} sm={6} xs={12} key={item.id}>
              <ShopCard1
                id={item.id}
                name={item.shopName || "Unnamed Shop"}
                phone={item.shopSettings?.phoneNumber || "N/A"}
                address={item.address?.city || "N/A"}
                rating={5}
                imgUrl={item.logo || "/placeholder-image.jpg"}
                coverImgUrl={item.banner || "/placeholder-banner.jpg"}
                shopUrl={`/shops/${item.id}`}
              />
            </Grid>
          );
        })}
      </Grid>

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt="32px"
      >
        <SemiSpan>Showing 1-9 of {shopListData.length} Shops</SemiSpan>
        <Pagination pageCount={Math.ceil(shopListData.length / 9)} />
      </FlexBox>
    </Fragment>
  );
}
