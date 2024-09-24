"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Box from "@component/Box";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import HoverBox from "@component/HoverBox";
import { H4 } from "@component/Typography";
import NextImage from "@component/NextImage";
import { Carousel } from "@component/carousel";
import CategorySectionCreator from "@component/CategorySectionCreator";
import { calculateDiscount, currency } from "@utils/utils";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";
import axios from "axios";
import Spinner from "@component/Spinner";
import { useQuery } from "@tanstack/react-query";
import SkeletonGrid from "@component/skeleton/SkeletonProducts";
import Container from "@component/Container";

// ========================================================
const fetchBigDiscounts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("/api/data/new-arrivals");
    console.log("New arrivals response:", response);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    return [];
  }
};
// ========================================================

export default function Section13() {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(6);

  useEffect(() => {
    if (width < 370) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(4);
    else setVisibleSlides(6);
  }, [width]);

  const {
    data: bigDiscountList,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["bigDiscounts"],
    queryFn: fetchBigDiscounts,
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: 1000 * 60 * 60 * 24, // Refresh every 60 seconds after
  });

  if (isLoading)
    return (
      <Container>
        <SkeletonGrid count={6} />
      </Container>
    );
  if (error) return <div>An error occurred: {error.message}</div>;

  // Ensure newArrivalsList is an array
  const productList = Array.isArray(bigDiscountList) ? bigDiscountList : [];

  return (
    <CategorySectionCreator
      iconName="gift"
      title="Big Discounts"
      seeMoreLink="#"
    >
      <Box my="-0.25rem">
        <Carousel
          totalSlides={bigDiscountList.length}
          visibleSlides={visibleSlides}
        >
          {productList.map((item) => (
            <Box py="0.25rem" key={item.id}>
              <Card p="1rem" borderRadius={8}>
                <Link href={`/product/${item.id}`}>
                  <HoverBox
                    borderRadius={8}
                    mb="0.5rem"
                    display="flex"
                    height="auto"
                  >
                    <NextImage
                      width={181}
                      height={181}
                      alt={item.name}
                      src={item.image}
                    />
                  </HoverBox>

                  <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
                    {item.name}
                  </H4>

                  <FlexBox>
                    <H4
                      fontWeight="600"
                      fontSize="14px"
                      color="primary.main"
                      mr="0.5rem"
                    >
                      {calculateDiscount(item.price, item.sale_price)}
                    </H4>

                    <H4 fontWeight="600" fontSize="14px" color="text.muted">
                      <del>{currency(item.price)}</del>
                    </H4>
                  </FlexBox>
                </Link>
              </Card>
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
}
