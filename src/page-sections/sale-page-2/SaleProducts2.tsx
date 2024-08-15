"use client";

import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Pagination from "@component/pagination";
import { SemiSpan } from "@component/Typography";
import { ProductCard1 } from "@component/product-cards";
import { renderProductCount } from "@utils/utils";
import Product from "@models/product.model";

type Meta = {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
};

type Props = {
  products: Product[];
  meta: Meta;
  onPageChange: (page: number) => void;
};

export default function SaleProducts2({ products, meta, onPageChange }: Props) {
  const handlePageChange = ({ selected }: { selected: number }) => {
    onPageChange(selected + 1);
  };

  return (
    <>
      <Grid container spacing={6}>
        {products.map((item) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={item.id}>
            <ProductCard1
              id={item.id}
              slug={item.slug}
              price={item.price}
              imgUrl={item.image || ""}
              rating={item.ratings || 0}
              off={item.discountPercentage || 0}
              images={item.gallery || []}
              shopId={item.shop?.id || ""}
              title={item.name}
              shop={
                item.shop
                  ? { id: item.shop.id, shopName: item.shop.shopName }
                  : null
              }
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
          {renderProductCount(meta.page, meta.pageSize, meta.total)}
        </SemiSpan>
        <Pagination onChange={handlePageChange} pageCount={meta.totalPage} />
      </FlexBox>
    </>
  );
}
