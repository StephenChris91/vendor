"use client";

import { useState, useMemo } from "react";

import Box from "@component/Box";
import Hidden from "@component/hidden";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import NextImage from "@component/NextImage";
import { ProductCard1 } from "@component/product-cards";
import CategorySectionHeader from "@component/CategorySectionHeader";
import StyledProductCategory from "./styled";
import Product from "@models/product.model";

// Import the popular brands
import { popularBrands } from "@data/primary-brands";

// ==============================================================
type Props = { fashionProducts: Product[] };
// ==============================================================

// Filter fashion brands
const fashionBrands = popularBrands.filter((brand) =>
  ["Zara", "H&M", "Gucci", "Louis Vuitton", "Nike", "Adidas"].includes(brand)
);

export default function Section6({ fashionProducts }: Props) {
  const [selected, setSelected] = useState("");

  const handleCategoryClick = (brand: string) => () => {
    if (selected === brand) setSelected("");
    else setSelected(brand);
  };

  const filteredProducts = useMemo(() => {
    if (selected === "" || selected === "all") return fashionProducts;
    return fashionProducts.filter(
      (product) => product.brand?.name.toLowerCase() === selected.toLowerCase()
    );
  }, [selected, fashionProducts]);

  return (
    <Container mb="80px">
      <FlexBox>
        <Hidden down={768} mr="1.75rem">
          <Box shadow={6} borderRadius={10} padding="1.25rem" bg="white">
            {fashionBrands.map((brand, index) => (
              <StyledProductCategory
                mb="0.75rem"
                id={index.toString()}
                key={index}
                title={brand}
                onClick={handleCategoryClick(brand)}
                shadow={selected === brand ? 4 : null}
                bg={selected === brand ? "white" : "gray.100"}
              >
                <Box width={20} height={20}>
                  <NextImage
                    width={20}
                    height={20}
                    alt={brand}
                    src={`/assets/images/brands/${brand
                      .toLowerCase()
                      .replace(/\s+/g, "-")}.png`}
                  />
                </Box>

                <span className="product-category-title">{brand}</span>
              </StyledProductCategory>
            ))}

            <StyledProductCategory
              id="all"
              mt="4rem"
              shadow={selected === "all" ? 4 : null}
              bg={selected === "all" ? "white" : "gray.100"}
              onClick={handleCategoryClick("all")}
            >
              <span className="product-category-title show-all">
                View All Brands
              </span>
            </StyledProductCategory>
          </Box>
        </Hidden>

        <Box flex="1 1 0" minWidth="0px">
          <CategorySectionHeader title="Fashion" seeMoreLink="#" />

          <Grid container spacing={6}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item, ind) => (
                <Grid item lg={4} sm={6} xs={12} key={ind}>
                  <ProductCard1
                    hoverEffect
                    id={item.id}
                    slug={item.slug}
                    title={item.name}
                    price={item.price}
                    off={item.discountPercentage}
                    rating={item.ratings || 0}
                    images={item.gallery}
                    imgUrl={item.image}
                    shop={item.shop}
                    shopId={item.shop?.id}
                    sale_price={item.sale_price}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Box textAlign="center" py={3}>
                  No products found for this brand.
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </FlexBox>
    </Container>
  );
}
