"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@component/Box";
import Container from "@component/Container";
import Navbar from "@component/navbar/Navbar";
import { Carousel } from "@component/carousel";
import { CarouselCard1 } from "@component/carousel-cards";
import MainCarouselItem from "@models/market-1.model";
import SkeletonGrid from "@component/skeleton/SkeletonProducts";

// Function to fetch carousel items
const fetchCarouselItems = async (): Promise<MainCarouselItem[]> => {
  const response = await fetch("/api/carousel");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export default function Section1() {
  const {
    data: carouselData,
    isLoading,
    error,
  } = useQuery<MainCarouselItem[]>({
    queryKey: ["carouselItems"],
    queryFn: fetchCarouselItems,
  });

  if (isLoading) {
    return (
      <Container>
        <SkeletonGrid count={1} height="400px" width="100%" />
      </Container>
    );
  }

  if (error) {
    console.error("Error fetching carousel items:", error);
    return <div>Error loading carousel items</div>;
  }

  return (
    <Fragment>
      <Navbar navListOpen={true} />

      <Box bg="gray.white" mb="3.75rem">
        <Container pb="2rem">
          {carouselData && carouselData.length > 0 ? (
            <Carousel
              spacing="0px"
              infinite={true}
              autoPlay={true}
              showDots={true}
              visibleSlides={1}
              showArrow={false}
              totalSlides={carouselData.length}
            >
              {carouselData.map((item, index) => (
                <CarouselCard1
                  key={index}
                  title={item.title}
                  image={item.imgUrl}
                  buttonText={item.buttonText}
                  // buttonLink={item.buttonLink}
                  description={item.description}
                />
              ))}
            </Carousel>
          ) : (
            <div>No carousel items available</div>
          )}
        </Container>
      </Box>
    </Fragment>
  );
}
