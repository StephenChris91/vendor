"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Carousel } from "@component/carousel";
import { ProductCard6 } from "@component/product-cards";
import CategorySectionCreator from "@component/CategorySectionCreator";
import useWindowSize from "@hook/useWindowSize";

// Define the Category type
type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
};

// Predefined array of categories with image paths
const topCategories: Category[] = [
  {
    id: "1",
    name: "Sunglasses",
    slug: "sunglasses",
    image: "/assets/images/top-categories/glasses.png",
  },
  {
    id: "2",
    name: "Watches",
    slug: "watches",
    image: "/assets/images/top-categories/watch.png",
  },
  {
    id: "3",
    name: "Jewelries",
    slug: "jewelries",
    image: "/assets/images/top-categories/jewelry.png",
  },
  {
    id: "4",
    name: "Headphones",
    slug: "headphones",
    image: "/assets/images/top-categories/gadgets.png",
  },
];

export default function Section3() {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    if (width < 650) setVisibleSlides(1);
    else if (width < 950) setVisibleSlides(2);
    else setVisibleSlides(3);
  }, [width]);

  return (
    <CategorySectionCreator
      iconName="categories"
      title="Top Categories"
      seeMoreLink="#"
    >
      <Carousel
        totalSlides={topCategories.length}
        visibleSlides={visibleSlides}
      >
        {topCategories.map((item) => (
          <Link href={`/product/search/${item.slug}`} key={item.id}>
            <ProductCard6
              title={item.name}
              subtitle={item.name}
              imgUrl={item.image}
            />
          </Link>
        ))}
      </Carousel>
    </CategorySectionCreator>
  );
}
