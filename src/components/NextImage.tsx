"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
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
    src: string | null | undefined;
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
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

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
