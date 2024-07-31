"use client";

// ShopDetails.tsx
import { Fragment } from "react";
import Grid from "@component/grid/Grid";
import ProductFilterCard from "@component/products/ProductFilterCard";
import ShopIntroCard from "@sections/shop/ShopIntroCard";
import ProductDetails from "@sections/shop/ProductDetails";
import Shop from "@models/shop.model";
import { useShopById } from "@utils/__api__/shops";
import { useParams } from "next/navigation";

export default function ShopDetails() {
  const { id } = useParams();
  const { data: shop, isLoading, error } = useShopById(id as string);

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error loading shop details. Please try again later.</div>;
  if (!shop) return <div>Shop not found</div>;

  return (
    <Fragment>
      <ShopIntroCard shop={shop} />

      <Grid container spacing={6}>
        <Grid item md={3} xs={12}>
          <ProductFilterCard />
        </Grid>

        <Grid item md={9} xs={12}>
          <ProductDetails shop={shop} />
        </Grid>
      </Grid>
    </Fragment>
  );
}
