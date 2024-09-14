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
  totalSold: number;
}

interface ProductStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
}

// const fetchTotalSold = async (productId: string): Promise<number> => {
//   try {
//     const response = await fetch(`/api/admin/products/${productId}/total-sold`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return data.totalSold;
//   } catch (error) {
//     console.error("Error fetching total sold:", error);
//     return 0;
//   }
// };

const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
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

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products", searchQuery, filters],
    queryFn: () => fetchProducts(),
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
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
      console.log("Sending update request:", updatedProduct);
      const response = await fetch(`/api/admin/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Server responded with an error:", data);
        throw new Error(
          data.error || data.message || "Failed to update product"
        );
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      toast.success("Product updated successfully");
      return data;
    },
    onError: (error: Error) => {
      console.error("Error updating product:", error);
      toast.error(`Failed to update product: ${error.message}`);
      throw error;
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
    try {
      await updateProductMutation.mutateAsync(updatedProduct);
    } catch (error) {
      console.error("Error in handleUpdateProduct:", error);
    }
  };

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
        // fetchTotalSold={fetchTotalSold}
      />
    </PageWrapper>
  );
}
