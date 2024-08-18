// app/admin/products/page.tsx
"use client";

import React, { useState } from "react";
import { H3 } from "@component/Typography";
import ProductList from "./product-list-component";
import ProductStatistics from "./product-stats";
import ProductSearchFilter from "./product-search";
import AddProductButton from "../add-product-button";
import BulkActions from "../bulk-actions-button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { PageWrapper, ResponsiveFlexBox } from "./styles";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories: { name: string }[];
  shop: { shopName: string };
  status: "Published" | "Draft" | "Suspended" | "OutOfStock";
}

interface ProductStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch("/api/products", {
    next: {
      revalidate: 0,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
};

const fetchProductStats = async (): Promise<ProductStats> => {
  const response = await fetch("/api/products/product-stats");
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
    mutationFn: async (updatedProduct: Partial<Product>) => {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product: ${error.message}`);
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
    console.log("Navigating to add product page");
  };

  const handleBulkAction = async (action: string) => {
    for (const productId of selectedProducts) {
      switch (action) {
        case "delete":
          // Implement delete logic
          break;
        case "publish":
          await updateProductMutation.mutateAsync({
            id: productId,
            status: "Published",
          });
          break;
        case "unpublish":
          await updateProductMutation.mutateAsync({
            id: productId,
            status: "Draft",
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

  const handleUpdateProduct = async (updatedProduct: Partial<Product>) => {
    await updateProductMutation.mutateAsync(updatedProduct);
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
        onUpdateProduct={handleUpdateProduct}
      />
    </PageWrapper>
  );
}
