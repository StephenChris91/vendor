"use client";

import styled from "styled-components";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { H2 } from "@component/Typography";
import { ProductCard1 } from "@component/product-cards";
import Product from "@models/product.model";

// STYLED COMPONENT
const GridOne = styled(Grid)({
  ".image-holder > a > span": { height: "100% !important" },
});

// ==========================================================
type Props = { products: Product[] };
// ==========================================================

export default function Section7({ products }: Props) {
  const trending = products.slice(1, products.length);

  return (
    <Box mb="3.75rem">
      <H2 mb="1.5rem">Trending Items</H2>

      <Grid container spacing={6}>
        <GridOne item md={4} xs={12}>
          <ProductCard1
            id={products[0].name}
            slug={products[0].slug}
            title={products[0].name}
            price={products[0].price}
            off={products[0].sale_price}
            rating={4}
            images={products[0].gallery}
            imgUrl={products[0].image}
            shopId={products[0].shop.id}
            sale_price={products[0].sale_price}
            shop={products[0].shop}
          />
        </GridOne>

        <Grid item md={8} xs={12}>
          <Grid container spacing={6}>
            {trending.map((item, ind) => (
              <Grid item lg={4} sm={6} xs={12} key={item.id}>
                <ProductCard1
                  id={item.id}
                  off={ind * 10}
                  slug={item.slug}
                  title={item.name}
                  price={item.price}
                  rating={4}
                  images={item.gallery}
                  imgUrl={item.image}
                  shopId={item.shop.id}
                  sale_price={item.sale_price}
                  shop={item.shop}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
