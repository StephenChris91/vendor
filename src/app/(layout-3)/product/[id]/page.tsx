"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ProductIntro from "@component/products/ProductIntro";
import ProductView from "@component/products/ProductView";
import { getProduct } from "actions/products/clientProductActions";
import {
  getAvailableShop,
  PartialShop,
} from "actions/products/getAvailableShops";
import { getRelatedProducts } from "actions/products/getRelatedProducts";
import { getFrequentlyBought } from "actions/products/getFrequentlyBought";
import Product from "@models/product.model";
import Spinner from "@component/Spinner";
import Container from "@component/Container";
import SkeletonGrid from "@component/skeleton/SkeletonProducts";

export default function ProductDetails() {
  const params = useParams();
  const id = params?.id; // Ensure `id` is correctly extracted

  // Fetch the product details using `useQuery`
  const { data: product, isLoading: productLoading } = useQuery<Product, Error>(
    {
      queryKey: ["product", id],
      queryFn: () => getProduct(id as string),
      refetchOnWindowFocus: false, // Disable refetching on window focus
    }
  );

  const { data: shops, isLoading: shopsLoading } = useQuery<
    PartialShop[],
    Error
  >({
    queryKey: ["availableShops"],
    queryFn: getAvailableShop,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<
    Product[],
    Error
  >({
    queryKey: ["relatedProducts", id],
    queryFn: () => getRelatedProducts(id as string),
    enabled: !!product, // Fetch related products only after product is fetched
    refetchIntervalInBackground: true,
    refetchInterval: 0,
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });

  const { data: frequentlyBought, isLoading: frequentlyBoughtLoading } =
    useQuery<Product[], Error>({
      queryKey: ["frequentlyBought", id],
      queryFn: () => getFrequentlyBought(id as string),
      refetchOnWindowFocus: false, // Disable refetching on window focus
    });

  if (
    productLoading ||
    shopsLoading ||
    relatedLoading ||
    frequentlyBoughtLoading
  ) {
    return (
      <Container>
        <SkeletonGrid count={8} />
      </Container>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Fragment>
      <ProductIntro product={product} />
      <ProductView
        product={product}
        shops={shops || []}
        relatedProducts={relatedProducts || []}
        frequentlyBought={frequentlyBought || []}
      />
    </Fragment>
  );
}
