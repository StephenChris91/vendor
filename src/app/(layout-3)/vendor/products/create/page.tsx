"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@component/buttons";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { ProductForm } from "@sections/vendor-dashboard/products";
import { SelectOption } from "@component/Select";

const fetchCategories = async (): Promise<SelectOption[]> => {
  const response = await axios.get("/api/products/categories");
  return response.data.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
};

export default function AddProduct() {
  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery<SelectOption[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const HEADER_LINK = (
    <Link href="/vendor/products">
      <Button color="primary" bg="primary.light" px="2rem">
        Back to Product List
      </Button>
    </Link>
  );

  return (
    <Fragment>
      <DashboardPageHeader
        title="Add Product"
        iconName="delivery-box"
        button={HEADER_LINK}
      />
      {isLoading ? (
        <div>Loading categories...</div>
      ) : isError ? (
        <div>Error loading categories</div>
      ) : (
        <ProductForm categoryOptions={categories || []} />
      )}
    </Fragment>
  );
}
