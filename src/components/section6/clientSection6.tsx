// components/ClientSection6.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Product from "@models/product.model";
import Shop from "@models/shop.model";
import Section6Content from "./section6Content";

export default function ClientSection6() {
  const [selected, setSelected] = useState("");

  const { data: oldestShops, isLoading: isLoadingShops } = useQuery<Shop[]>({
    queryKey: ["oldestShops"],
    queryFn: async () => {
      const response = await fetch("/api/shop/oldest");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: randomProducts, isLoading: isLoadingRandomProducts } = useQuery<
    Product[]
  >({
    queryKey: ["randomProducts"],
    queryFn: async () => {
      const response = await fetch("/api/products/random");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  const { data: shopProducts, isLoading: isLoadingShopProducts } = useQuery<
    Product[]
  >({
    queryKey: ["shopProducts", selected],
    queryFn: async () => {
      if (!selected) return [];
      const response = await fetch(`/api/products/featured?shopId=${selected}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    enabled: !!selected,
  });

  const handleShopClick = (shopId: string) => () => {
    setSelected(shopId);
  };

  const displayProducts = selected ? shopProducts : randomProducts;
  const isLoadingProducts = selected
    ? isLoadingShopProducts
    : isLoadingRandomProducts;

  return (
    <Section6Content
      oldestShops={oldestShops}
      isLoadingShops={isLoadingShops}
      displayProducts={displayProducts}
      isLoadingProducts={isLoadingProducts}
      selected={selected}
      handleShopClick={handleShopClick}
    />
  );
}
