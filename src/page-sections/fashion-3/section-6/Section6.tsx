"use client";

import Grid from "@component/grid/Grid";
import { H2 } from "@component/Typography";
import Container from "@component/Container";
import ProductCard17 from "@component/product-cards/ProductCard17";
import Product from "@models/product.model";

// ========================================================
type Section6Props = { products: Product[] };
// ========================================================

export default function Section6({ products }: Section6Props) {
  return (
    <Container mt="4rem">
      <H2 textAlign="center" mb={4}>
        Featured Products
      </H2>

      <Grid container spacing={5}>
        {products.map((product, i) => (
          <Grid item md={3} sm={6} xs={12} key={product.id + i}>
            <ProductCard17
              id={product.id}
              slug={product.slug}
              title={product.name}
              price={product.price}
              images={product.gallery}
              imgUrl={product.image}
              category={
                product.categories.map(
                  (category) => category[0].name
                ) as unknown as string
              }
              reviews={5}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
