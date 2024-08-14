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

export default function ProductDetails() {
  const { id } = useParams();

  const { data: product, isLoading: productLoading } = useQuery<Product, Error>(
    {
      queryKey: ["product", id],
      queryFn: () => getProduct(id as string),
    }
  );

  const { data: shops, isLoading: shopsLoading } = useQuery<
    PartialShop[],
    Error
  >({
    queryKey: ["availableShops"],
    queryFn: getAvailableShop,
  });

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<
    Product[],
    Error
  >({
    queryKey: ["relatedProducts", id],
    queryFn: () => getRelatedProducts(id as string),
    enabled: !!product,
  });

  const { data: frequentlyBought, isLoading: frequentlyBoughtLoading } =
    useQuery<Product[], Error>({
      queryKey: ["frequentlyBought", id],
      queryFn: () => getFrequentlyBought(id as string),
      enabled: !!product,
    });

  if (
    productLoading ||
    shopsLoading ||
    relatedLoading ||
    frequentlyBoughtLoading
  ) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <Fragment>
      <ProductIntro
        id={product.id}
        price={product.price}
        title={product.name}
        image={product.image}
        gallery={product.gallery}
        shop={product.shop || undefined}
      />

      <ProductView
        product={product}
        shops={shops ?? []}
        relatedProducts={relatedProducts ?? []}
        frequentlyBought={frequentlyBought ?? []}
      />
    </Fragment>
  );
}
