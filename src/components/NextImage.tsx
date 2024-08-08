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

// Update the type definition for src to include StaticImageData
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
  // Ensure imgSrc can handle both string and StaticImageData types
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(
    src || fallbackSrc
  );

  return (
    <StyledImage
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default NextImage;
