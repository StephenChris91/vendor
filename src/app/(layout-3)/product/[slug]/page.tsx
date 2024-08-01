"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ProductIntro from "@component/products/ProductIntro";
import ProductView from "@component/products/ProductView";
import {
  getProduct,
  getRelatedProducts,
  getFrequentlyBought,
} from "actions/products/clientProductActions";
import { getAvailableShop } from "actions/products/getAvailableShops";
import { product, shop } from "@prisma/client";

export default function ProductDetails() {
  const { slug } = useParams();

  const { data: product, isLoading: productLoading } = useQuery<product, Error>(
    {
      queryKey: ["product", slug],
      queryFn: () => getProduct(slug as string),
    }
  );

  const { data: shops, isLoading: shopsLoading } = useQuery<
    Partial<shop>[],
    Error
  >({
    queryKey: ["availableShops"],
    queryFn: getAvailableShop,
  });

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<
    product[],
    Error
  >({
    queryKey: ["relatedProducts", slug],
    queryFn: () => getRelatedProducts(slug as string),
  });

  const { data: frequentlyBought, isLoading: frequentlyBoughtLoading } =
    useQuery<product[], Error>({
      queryKey: ["frequentlyBought", slug],
      queryFn: () => getFrequentlyBought(slug as string),
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
        images={product.gallery}
      />

      <ProductView
        product={product}
        shops={shops || []}
        relatedProducts={relatedProducts || []}
        frequentlyBought={frequentlyBought || []}
      />
    </Fragment>
  );
}
