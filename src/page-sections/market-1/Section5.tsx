"use client";

import { useQuery } from "@tanstack/react-query";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import ProductCard2 from "@component/product-cards/ProductCard2";
import CategorySectionCreator from "@component/CategorySectionCreator";
import Product from "@models/product.model";
import axios from "axios";
import Spinner from "@component/Spinner";

// Function to fetch new arrivals
const fetchNewArrivals = async (): Promise<Product[]> => {
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

type Props = { newArrivalsList: Product[] };

export default function Section5() {
  // Using useQuery to fetch and manage the data
  const {
    data: newArrivalsList,
    isLoading,
    error,
  } = useQuery<Product[], Error>({
    queryKey: ["newArrivals"],
    queryFn: fetchNewArrivals,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {error.message}</div>;

  // Ensure newArrivalsList is an array
  const productList = Array.isArray(newArrivalsList) ? newArrivalsList : [];

  return (
    <CategorySectionCreator
      iconName="new-product-1"
      title="New Arrivals"
      seeMoreLink="#"
    >
      <Card p="1rem" borderRadius={8}>
        <Grid container spacing={6}>
          {productList.map((item) => (
            <Grid item lg={2} md={3} sm={4} xs={6} key={item.id}>
              <ProductCard2
                slug={item.slug}
                title={item.name}
                price={item.price}
                imgUrl={item.image || ""}
              />
            </Grid>
          ))}
          {productList.length === 0 && (
            <Grid item xs={12}>
              <p>No new arrivals available.</p>
            </Grid>
          )}
        </Grid>
      </Card>
    </CategorySectionCreator>
  );
}
