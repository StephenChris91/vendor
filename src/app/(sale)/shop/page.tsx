"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@component/Container";
import SaleProducts2 from "@sections/sale-page-2/SaleProducts2";
import { getAllProducts } from "actions/products/getProducts";

export default function SalePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const PAGE_SIZE = 28;

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, PAGE_SIZE],
    queryFn: () => getAllProducts(page, PAGE_SIZE),
  });

  if (isLoading) return <Container mt="2rem">Loading...</Container>;

  if (error) {
    console.error("Error in SalePage:", error);
    return (
      <Container mt="2rem">
        <div>
          An error occurred:{" "}
          {error instanceof Error ? error.message : String(error)}
        </div>
        <div>
          Please try refreshing the page or contact support if the problem
          persists.
        </div>
      </Container>
    );
  }

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

  return (
    <Container mt="2rem">
      {data && (
        <SaleProducts2
          products={data.products}
          meta={data.meta}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
}
