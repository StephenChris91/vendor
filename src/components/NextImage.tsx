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
    width?: number;
    height?: number;
  };

const StyledImage = styled(Image)<NextImageProps>(
  { objectFit: "cover" },
  compose(space, borderRadius)
);

const NextImage = ({
  src,
  fallbackSrc = "/placeholder-image.jpg",
  alt,
  width,
  height,
  ...props
}: NextImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    src || fallbackSrc
  );

  return (
    <StyledImage
      {...props}
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        console.error(`Error loading image: ${src}`);
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default NextImage;
