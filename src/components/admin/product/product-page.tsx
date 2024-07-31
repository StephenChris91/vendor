// app/admin/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { H3 } from "@component/Typography";
import ProductList from "./product-list-component";
import ProductStatistics from "./product-stats";
import ProductSearchFilter from "./product-search";
import AddProductButton from "../add-product-button";
import BulkActions from "../bulk-actions-button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageWrapper, ResponsiveFlexBox } from "./styles";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  vendor: string;
  status: string;
}

interface ProductStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/products");
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const fetchProductStats = async (): Promise<ProductStats> => {
  const response = await fetch("/api/product-stats");
  if (!response.ok) {
    throw new Error("Failed to fetch product stats");
  }
  return response.json();
};

export default function ProductsPage() {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "" });

  const queryClient = useQueryClient();

  const { data: products = [], isLoading: isLoadingProducts } = useQuery<
    Product[]
  >({
    queryKey: ["products", searchQuery, filters],
    queryFn: () => fetchProducts(),
  });

  const {
    data: stats = { totalProducts: 0, outOfStock: 0, lowStock: 0 },
    isLoading: isLoadingStats,
  } = useQuery<ProductStats>({
    queryKey: ["productStats"],
    queryFn: fetchProductStats,
  });

  const updateProductMutation = useMutation({
    mutationFn: (updatedProduct: Partial<Product>) =>
      fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: { category: string; status: string }) => {
    setFilters(newFilters);
  };

  const handleAddProduct = () => {
    // Navigate to add product page
    // You'll need to implement this navigation logic
    console.log("Navigating to add product page");
  };

  const handleBulkAction = async (action: string) => {
    for (const productId of selectedProducts) {
      switch (action) {
        case "delete":
          // Implement delete logic
          break;
        case "activate":
          await updateProductMutation.mutateAsync({
            id: productId,
            status: "active",
          });
          break;
        case "deactivate":
          await updateProductMutation.mutateAsync({
            id: productId,
            status: "inactive",
          });
          break;
      }
    }
    setSelectedProducts([]);
  };

  const handleProductSelection = (productId: string, isSelected: boolean) => {
    setSelectedProducts((prev) =>
      isSelected ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  if (isLoadingProducts || isLoadingStats) {
    return <div>Loading...</div>;
  }

  return (
    <PageWrapper>
      <ResponsiveFlexBox
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <H3>Product Management</H3>
        <AddProductButton onClick={handleAddProduct} />
      </ResponsiveFlexBox>

      <ProductStatistics stats={stats} />

      <ProductSearchFilter onSearch={handleSearch} onFilter={handleFilter} />

      <BulkActions
        selectedCount={selectedProducts.length}
        onAction={handleBulkAction}
      />

      <ProductList
        products={products}
        onSelect={handleProductSelection}
        selectedProducts={selectedProducts}
        onUpdateProduct={updateProductMutation.mutate}
      />
    </PageWrapper>
  );
}
