"use client";

import Link from "next/link";
import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

import Box from "@component/Box";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import LazyImage from "@component/LazyImage";
import Typography from "@component/Typography";
import { IconButton } from "@component/buttons";

import { currency, getTheme, isValidProp } from "@utils/utils";
import { useCart } from "hooks/useCart"; // Import the new useCart hook

// STYLED COMPONENTS
const Wrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => isValidProp(prop),
})`
  display: flex;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  box-shadow: ${getTheme("shadows.4")};
  background-color: ${getTheme("colors.body.paper")};

  .product-details {
    padding: 20px;
  }
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  @media only screen and (max-width: 425px) {
    flex-wrap: wrap;
    img {
      height: auto;
      min-width: 100%;
    }
  }
  ${space}
`;

// =====================================================================
interface ProductCard7Props extends SpaceProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  imgUrl?: string;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}
// =====================================================================

export default function ProductCard7({
  id,
  name,
  quantity,
  price,
  imgUrl,
  slug,
  onQuantityChange,
  onRemove,
  ...others
}: ProductCard7Props) {
  const handleQuantityChange = (newQuantity: number) => {
    onQuantityChange(newQuantity);
  };

  return (
    <Wrapper {...others}>
      <LazyImage
        alt={name}
        width={140}
        height={140}
        src={imgUrl || "/assets/images/products/iphone-xi.png"}
      />

      <FlexBox
        width="100%"
        minWidth="0px"
        flexDirection="column"
        className="product-details"
        justifyContent="space-between"
      >
        <Link href={`/product/${slug}`}>
          <Typography
            className="title"
            fontWeight="600"
            fontSize="18px"
            mb="0.5rem"
          >
            {name}
          </Typography>
        </Link>

        <Box position="absolute" right="1rem" top="1rem">
          <IconButton padding="4px" ml="12px" onClick={onRemove}>
            <Icon size="1.25rem">close</Icon>
          </IconButton>
        </Box>

        <FlexBox justifyContent="space-between" alignItems="flex-end">
          <FlexBox flexWrap="wrap" alignItems="center">
            <Typography color="gray.600" mr="0.5rem">
              {currency(price)} x {quantity}
            </Typography>

            <Typography fontWeight={600} color="primary.main" mr="1rem">
              {currency(price * quantity)}
            </Typography>
          </FlexBox>

          <FlexBox alignItems="center">
            <Button
              size="none"
              padding="5px"
              color="primary"
              variant="outlined"
              disabled={quantity === 1}
              borderColor="primary.light"
              onClick={() => handleQuantityChange(quantity - 1)}
            >
              <Icon variant="small">minus</Icon>
            </Button>

            <Typography mx="0.5rem" fontWeight="600" fontSize="15px">
              {quantity}
            </Typography>

            <Button
              size="none"
              padding="5px"
              color="primary"
              variant="outlined"
              borderColor="primary.light"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Icon variant="small">plus</Icon>
            </Button>
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </Wrapper>
  );
}
