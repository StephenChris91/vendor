"use client";

import { useEffect, useState } from "react";

import { H2 } from "@component/Typography";
import Container from "@component/Container";
import { ProductCard17 } from "@component/product-cards";
import { Carousel, CarouselWrapper } from "@component/carousel";
import useWindowSize from "@hook/useWindowSize";
import Product from "@models/product.model";

// ======================================================================
type Section6Props = { products: Product[] };
// ======================================================================

export default function Section6({ products }: Section6Props) {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(4);

  useEffect(() => {
    if (width < 426) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 1024) setVisibleSlides(3);
    else if (width < 1200) setVisibleSlides(4);
    else setVisibleSlides(5);
  }, [width]);

  return (
    <Container mt="4rem">
      <H2 textAlign="center" mb={4}>
        Featured Products
      </H2>

      <CarouselWrapper>
        <Carousel totalSlides={products.length} visibleSlides={visibleSlides}>
          {products.map((product) => (
            <ProductCard17
              id={product.id}
              key={product.id}
              slug={product.slug}
              title={product.name}
              price={product.price}
              images={product.gallery}
              imgUrl={product.image}
              category={
                product.categories.map(
                  (category) => category[0].name
                ) as unknown as string
              }
              reviews={21}
            />
          ))}
        </Carousel>
      </CarouselWrapper>
    </Container>
  );
}
