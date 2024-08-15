"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import ProductCard1 from "@component/product-cards/ProductCard1";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { getWishlist } from "actions/wishlist/getWishlist";

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    rating: number;
    discount: number;
    images: string[];
  };
}

export default function WishList() {
  const { data, isLoading, error } = useQuery<
    { wishlist: WishlistItem[] },
    Error
  >({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const result = await getWishlist();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        An error occurred:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );

  const wishlistItems = data?.wishlist || [];

  return (
    <Fragment>
      <DashboardPageHeader
        title="My Wish List"
        iconName="heart_filled"
        button={
          <Button color="primary" bg="primary.light" px="2rem">
            Add All to Cart
          </Button>
        }
      />

      <Grid container spacing={6}>
        {wishlistItems.map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.product.id}
              slug={item.product.slug}
              title={item.product.name}
              price={item.product.price}
              imgUrl={item.product.image}
              rating={item.product.rating}
              off={item.product.discount}
              images={item.product.images}
              shopId="" // We don't have shop info in the current data structure
              shop={null} // We don't have shop info in the current data structure
              sale_price={
                item.product.price * (1 - item.product.discount / 100)
              } // Calculate sale price
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={5} onChange={(data) => console.log(data)} />
      </FlexBox>
    </Fragment>
  );
}
