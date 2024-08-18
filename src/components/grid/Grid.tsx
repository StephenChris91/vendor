"use client";

import { Children, cloneElement, isValidElement, ReactElement } from "react";
import { FlexboxProps } from "styled-system";
// STYLED COMPONENT
import StyledGrid from "./styles";
// PROPS TYPES
import { GridProps } from "./types";

export default function Grid({
  children,
  spacing = 0,
  vertical_spacing,
  horizontal_spacing,
  containerHeight = "unset",
  ...props
}: GridProps & FlexboxProps) {
  let childList = children;

  if (props.container) {
    childList = Children.map(children, (child) => {
      // Ensure the child is a valid React element before cloning it
      if (isValidElement(child)) {
        // Add type assertion to the child as ReactElement<any>
        return cloneElement(child as ReactElement<any>, {
          spacing,
          vertical_spacing,
          horizontal_spacing,
        });
      }
      // If the child is not a valid React element, return it as is
      return child;
    });
  }

  return (
    <StyledGrid
      spacing={spacing}
      containerHeight={containerHeight}
      vertical_spacing={vertical_spacing}
      horizontal_spacing={horizontal_spacing}
      {...props}
    >
      {childList}
    </StyledGrid>
  );
}
