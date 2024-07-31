"use client";

import { ReactNode } from "react";
import { BorderProps, ColorProps } from "styled-system";
import StyledAvatar from "./styles";
import NextImage from "@component/NextImage";

export interface AvatarProps extends BorderProps, ColorProps {
  src?: string | null;
  size?: number;
  children?: ReactNode;
  [key: string]: any;
}

export default function Avatar({
  src,
  size = 48,
  children,
  ...props
}: AvatarProps) {
  return (
    <StyledAvatar size={size} {...props}>
      {src ? (
        <NextImage
          src={src}
          alt="avatar"
          width={size}
          height={size}
          fallbackSrc="/placeholder-avatar.jpg"
        />
      ) : children ? (
        <span>{children}</span>
      ) : (
        <NextImage
          src="/placeholder-avatar.jpg"
          alt="placeholder avatar"
          width={size}
          height={size}
        />
      )}
    </StyledAvatar>
  );
}
