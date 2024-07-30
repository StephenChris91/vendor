"use client";

import { useEffect, useState } from "react";
import Box from "@component/Box";
import { Carousel } from "@component/carousel";
import { H1, Paragraph } from "@component/Typography";
import { ProductCard13 } from "@component/product-cards";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";

// =====================================================
type Props = { products: Product[]; title: string };
// =====================================================

export default function Section3({ products, title }: Props) {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    if (width <= 600) setVisibleSlides(1);
    else if (width < 950) setVisibleSlides(2);
    else setVisibleSlides(3);
  }, [width]);

  return (
    <Box mt={5}>
      <Box mb={4}>
        <H1 mb="4px">{title}</H1>
        <Paragraph color="grey.600">
          Tall blind but were, been folks not the expand
        </Paragraph>
      </Box>

      <Box my="-0.25rem">
        <Carousel
          showArrowOnHover={true}
          arrowButtonColor="inherit"
          totalSlides={products.length}
          visibleSlides={visibleSlides}
        >
          {products.map((item, ind) => (
            <Box py="0.25rem" key={ind}>
              <ProductCard13
                id={item.id}
                slug={item.slug}
                title={item.name}
                price={item.price}
                off={item.sale_price}
                status={item.status}
                rating={4}
                imgUrl={item.image}
                // productColors={item.name as string}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}
