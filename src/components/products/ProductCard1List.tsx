import React from "react";
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import ProductCard1 from "@component/product-cards/ProductCard1";
import { SemiSpan } from "@component/Typography";
import Product from "@models/product.model";

// ==========================================================
type Props = {
  products: Product[];
};
// ==========================================================

export default function ProductCard1List({ products }: Props) {
  return (
    <>
      <Grid container spacing={6}>
        {products.map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              title={item.name}
              price={item.price}
              imgUrl={item.image}
              rating={item.ratings}
              off={item.sale_price}
              images={item?.gallery}
              shopId={item.shop.id}
            />
          </Grid>
        ))}
      </Grid>

      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        mt="32px"
      >
        <SemiSpan>Showing 1-9 of {products.length} Products</SemiSpan>
        <Pagination pageCount={Math.ceil(products.length / 9)} />
      </FlexBox>
    </>
  );
}
