"use client";

import React, { useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import styled from "styled-components";
import {
  space,
  SpaceProps,
  compose,
  borderRadius,
  BorderRadiusProps,
} from "styled-system";

type NextImageProps = Omit<ImageProps, "src"> &
  SpaceProps &
  BorderRadiusProps & {
    src: string | StaticImageData | null | undefined;
    fallbackSrc?: string;
  };

const StyledImage = styled(Image)<NextImageProps>(
  { width: "100%", height: "auto" },
  compose(space, borderRadius)
);

const NextImage = ({
  src,
  fallbackSrc = "/placeholder-image.jpg",
  alt,
  ...props
}: NextImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    src || fallbackSrc
  );

  console.log("NextImage src:", src); // Add this line for debugging

  return (
    <StyledImage
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        console.error(`Error loading image: ${src}`);
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default NextImage;
