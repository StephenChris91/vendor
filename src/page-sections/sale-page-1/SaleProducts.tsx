"use client";

import { useRouter } from "next/navigation";

import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import { SemiSpan } from "@component/Typography";
import { ProductCard1 } from "@component/product-cards";
import { renderProductCount } from "@utils/utils";
import Product from "@models/product.model";
import { Meta } from "interfaces";

// ==============================================================
type Props = {
  meta: Meta;
  products: Product[];
};
// ==============================================================

export default function SaleProducts({ products, meta }: Props) {
  const { push } = useRouter();

  const handlePageChange = ({ selected }: { selected: number }) => {
    push(`?page=${selected + 1}`);
  };

  return (
    <>
      <Grid container spacing={6}>
        {products.map((item: Product, ind: number) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              price={item.price}
              title={item.name}
              off={item.sale_price}
              images={item.gallery}
              imgUrl={item.image}
              rating={4}
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
        my="4rem"
      >
        <SemiSpan>
          {renderProductCount(meta.page - 1, meta.pageSize, meta.total)}
        </SemiSpan>
        <Pagination onChange={handlePageChange} pageCount={meta.totalPage} />
      </FlexBox>
    </>
  );
}
