// app/admin/products/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";
import ProductStatistics from "@component/admin/ProductStatistics";
import ProductSearchFilter from "@component/admin/ProductSearchFilter";
import ProductList from "@component/admin/ProductList";
import AddProductButton from "@component/admin/AddProductButton";
import BulkActions from "@component/admin/BulkActions";

const PageWrapper = styled(Box)`
  padding: 2rem;
`;

const ResponsiveFlexBox = styled(FlexBox)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Mock data - replace with actual API calls in production
const mockProducts = [
  {
    id: "1",
    name: "Product 1",
    sku: "SKU001",
    price: 19.99,
    stock: 100,
    category: "Electronics",
    vendor: "Vendor A",
    status: "active",
  },
  {
    id: "2",
    name: "Product 2",
    sku: "SKU002",
    price: 29.99,
    stock: 50,
    category: "Clothing",
    vendor: "Vendor B",
    status: "inactive",
  },
  // Add more mock products as needed
];

const mockStats = {
  totalProducts: 1000,
  outOfStock: 50,
  lowStock: 100,
};

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [stats, setStats] = useState(mockStats);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // useEffect(() => {
  //   // Fetch products and stats data
  //   // setProducts(fetchedProducts);
  //   // setStats(fetchedStats);
  // }, []);

  const handleSearch = (query: string) => {
    // Implement search logic
    console.log("Searching for:", query);
  };

  const handleFilter = (filters: any) => {
    // Implement filter logic
    console.log("Applying filters:", filters);
  };

  const handleAddProduct = () => {
    // Implement add product logic
    console.log("Adding new product");
  };

  const handleBulkAction = (action: string) => {
    // Implement bulk action logic
    console.log("Bulk action:", action, "on products:", selectedProducts);
  };

  const handleProductSelection = (productId: string, isSelected: boolean) => {
    setSelectedProducts((prev) =>
      isSelected ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
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
      />
    </PageWrapper>
  );
}
