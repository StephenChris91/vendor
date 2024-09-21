"use client";

import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import ProductCard1 from "@component/product-cards/ProductCard1";
import CategorySectionHeader from "@component/CategorySectionHeader";
import Product from "@models/product.model";
import axios from "axios";
import Spinner from "@component/Spinner";
import { useQuery } from "@tanstack/react-query";
import SkeletonGrid from "@component/skeleton/SkeletonProducts";

// ====================================================
const fetchMore = async (): Promise<Product[]> => {
  try {
    const response = await axios.get("/api/data/get-more-items");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.error("Response data:", error.response?.data);
      // console.error("Response status:", error.response?.status);
    }
    return [];
  }
};
// ====================================================

export default function Section11() {
  const {
    data: newArrivalsList,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["moreItems"],
    queryFn: fetchMore,
    staleTime: Infinity, // Keep the data fresh indefinitely
    gcTime: 1000 * 60 * 60 * 24, // Refresh every 60 seconds after last update
  });

  if (isLoading) return <SkeletonGrid count={6} />;
  if (error) return <div>An error occurred: {error.message}</div>;

  // Ensure newArrivalsList is an array
  const productList = Array.isArray(newArrivalsList) ? newArrivalsList : [];

  return (
    <Container mb="70px">
      <CategorySectionHeader title="More For You" seeMoreLink="#" />

      <Grid container spacing={6}>
        {productList.map((item, ind) => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={ind}>
            <ProductCard1
              hoverEffect
              id={item.id}
              slug={item.slug}
              title={item.name}
              price={item.price}
              off={item.sale_price}
              rating={4}
              imgUrl={item.image}
              images={item.gallery as string[]}
              shop={item.shop}
              shopId={item.shop?.id}
              sale_price={item.sale_price}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
