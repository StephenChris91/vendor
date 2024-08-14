"use client";

import { useState, useMemo } from "react";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H5 } from "@component/Typography";
import ProductReview from "@component/products/ProductReview";
import AvailableShops from "@component/products/AvailableShops";
import RelatedProducts from "@component/products/RelatedProducts";
import FrequentlyBought from "@component/products/FrequentlyBought";
import ProductDescription from "@component/products/ProductDescription";
import Product from "@models/product.model";
import { PartialShop } from "actions/products/getAvailableShops";

type Props = {
  product: Product;
  shops: PartialShop[]; // Change this line
  relatedProducts: Product[];
  frequentlyBought: Product[];
};

export default function ProductView({
  product,
  shops,
  relatedProducts,
  frequentlyBought,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<
    "description" | "review"
  >("description");

  const handleOptionClick = (opt: "description" | "review") => () =>
    setSelectedOption(opt);

  const reviewCount = useMemo(() => {
    return product.total_reviews || 0;
  }, [product]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <FlexBox
        borderBottom="1px solid"
        borderColor="gray.400"
        mt="80px"
        mb="26px"
      >
        <H5
          mr="25px"
          p="4px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("description")}
          borderBottom={selectedOption === "description" ? "2px solid" : ""}
          color={
            selectedOption === "description" ? "primary.main" : "text.muted"
          }
        >
          Description
        </H5>

        <H5
          p="4px 10px"
          className="cursor-pointer"
          borderColor="primary.main"
          onClick={handleOptionClick("review")}
          borderBottom={selectedOption === "review" ? "2px solid" : ""}
          color={selectedOption === "review" ? "primary.main" : "text.muted"}
        >
          Review ({reviewCount})
        </H5>
      </FlexBox>

      <Box mb="50px">
        {selectedOption === "description" && (
          <ProductDescription product={product} />
        )}
        {selectedOption === "review" && <ProductReview product={product} />}
      </Box>

      {frequentlyBought.length > 0 && (
        <FrequentlyBought products={frequentlyBought} />
      )}
      {shops.length > 0 && <AvailableShops shops={shops} />}
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </>
  );
}
