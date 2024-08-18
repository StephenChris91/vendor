"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@component/avatar";
import Hidden from "@component/hidden";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Pagination from "@component/pagination";
import { IconButton } from "@component/buttons";
import Typography, { H5 } from "@component/Typography";
import { calculateDiscount, currency } from "@utils/utils";
import { Meta } from "interfaces";
import { ProductType } from "types";

interface Props {
  meta: Meta;
  products: ProductType[];
}

export default function ProductsList({ meta, products }: Props) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    router.push(`/vendor/products?page=${newPage}`);
  };

  return (
    <>
      {products?.map((item) => {
        const discountedPrice = calculateDiscount(item.price, item.sale_price);

        return (
          <Link href={`/vendor/products/${item.slug}`} key={item.id}>
            <TableRow my="1rem" padding="6px 18px">
              <FlexBox alignItems="center" m="6px" flex="2 2 220px !important">
                <Avatar src={item.image} size={36} />
                <Typography textAlign="left" ml="20px">
                  {item.name}
                </Typography>
              </FlexBox>

              <H5 m="6px" textAlign="left" fontWeight="400">
                {currency(item.price)}
              </H5>

              <H5 m="6px" textAlign="left" fontWeight="400">
                {currency(discountedPrice)}
              </H5>

              <Hidden flex="0 0 0 !important" down={769}>
                <Typography textAlign="center" color="text.muted">
                  <IconButton>
                    <Icon variant="small" defaultcolor="currentColor">
                      arrow-right
                    </Icon>
                  </IconButton>
                </Typography>
              </Hidden>
            </TableRow>
          </Link>
        );
      })}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination
          pageCount={meta?.totalPage || 1}
          onChange={({ selected }) => handlePageChange(selected + 1)}
        />
      </FlexBox>
    </>
  );
}
