"use client";

import { useEffect, useState } from "react";

import Box from "@component/Box";
import { Carousel } from "@component/carousel";
import { ProductCard1 } from "@component/product-cards";
import CategorySectionCreator from "@component/CategorySectionCreator";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "@component/Spinner";

// =============================================================
// Function to fetch new arrivals
const fetchFlashDeals = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("/api/data/flash-deals");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    if (axios.isAxiosError(error)) {
      // console.error("Response data:", error.response?.data);
      // console.error("Response status:", error.response?.status);
    }
    return [];
  }
};
// =============================================================

export default function Section2() {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(4);

  const queryClient = useQueryClient();
  useEffect(() => {
    if (width < 500) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);

  const {
    data: flashDealsData,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["flashDeals"],
    queryFn: fetchFlashDeals,
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: 1000 * 60 * 60 * 24, // Replace cacheTime with gcTime
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {error.message}</div>;

  // Ensure newArrivalsList is an array
  const productList = Array.isArray(flashDealsData) ? flashDealsData : [];

  return (
    <CategorySectionCreator
      iconName="light"
      title="Flash Deals"
      seeMoreLink="#"
    >
      <Box mt="-0.25rem" mb="-0.25rem">
        <Carousel
          totalSlides={productList.length}
          visibleSlides={visibleSlides}
        >
          {productList.map((item, ind) => (
            <Box py="0.25rem" key={ind}>
              <ProductCard1
                key={ind}
                id={item.id}
                slug={item.slug}
                price={item.price}
                title={item.name}
                off={item.sale_price}
                images={item.gallery}
                imgUrl={item.image}
                rating={4}
                shop={item.shop}
                shopId={item.shop?.id}
                sale_price={item.sale_price}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </CategorySectionCreator>
  );
}

export function invalidateFlashDealsCache() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["flashDeals"] });
}
