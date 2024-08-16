// components/products/ProductCard1List.tsx
import FlexBox from "@component/FlexBox";
import Grid from "@component/grid/Grid";
import Pagination from "@component/pagination";
import { ProductCard1 } from "@component/product-cards";
import { SemiSpan } from "@component/Typography";
import Product from "@models/product.model";

// ==========================================================
type Props = { products: Product[] };
// ==========================================================

export default function ProductGridView({ products }: Props) {
  return (
    <div>
      <Grid container spacing={6}>
        {products.map((item) => (
          <Grid item lg={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              price={item.price}
              title={item.name}
              off={item.sale_price}
              images={item.gallery}
              imgUrl={item.image}
              rating={item.ratings || 4}
              shopId={item.shop.id}
              shop={item.shop}
              sale_price={item.sale_price}
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
        <SemiSpan>Showing 1-9 of 1.3k Products</SemiSpan>
        <Pagination pageCount={products.length} />
      </FlexBox>
    </div>
  );
}
