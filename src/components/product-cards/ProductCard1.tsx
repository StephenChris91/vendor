"use client";

import Link from "next/link";
import { Fragment, useCallback, useState } from "react";
import styled from "styled-components";

import { useCart } from "hooks/useCart";

import Box from "@component/Box";
import Rating from "@component/rating";
import { Chip } from "@component/Chip";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import NextImage from "@component/NextImage";
import Card, { CardProps } from "@component/Card";
import Typography, { H3, SemiSpan } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";

import { calculateDiscount, currency, getTheme } from "@utils/utils";
import { deviceSize } from "@utils/constants";
import Product from "@models/product.model";
import { ProductStatus, ProductType } from "@prisma/client";

// STYLED COMPONENT
const Wrapper = styled(Card)`
  margin: auto;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: space-between;
  transition: all 250ms ease-in-out;

  &:hover {
    .details {
      .add-cart {
        display: flex;
      }
    }
    .image-holder {
      .extra-icons {
        display: block;
      }
    }
  }

  .image-holder {
    text-align: center;
    position: relative;
    display: inline-block;
    height: 100%;

    .extra-icons {
      z-index: 2;
      top: 0.75rem;
      display: none;
      right: 0.75rem;
      cursor: pointer;
      position: absolute;
    }

    @media only screen and (max-width: ${deviceSize.sm}px) {
      display: block;
    }
  }

  .details {
    padding: 1rem;

    .title,
    .categories {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icon-holder {
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      justify-content: space-between;
    }

    .favorite-icon {
      cursor: pointer;
    }
    .outlined-icon {
      svg path {
        fill: ${getTheme("colors.text.hint")};
      }
    }
    .add-cart {
      display: none;
      margin-top: auto;
      align-items: center;
      flex-direction: column;
    }
  }

  @media only screen and (max-width: 768px) {
    .details {
      .add-cart {
        display: flex;
      }
    }
  }
`;

// =======================================================================
interface ProductCard1Props extends CardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  imgUrl: string;
  rating: number;
  off?: number;
  images: string[];
  shopId: string;
  shop: {
    shopName?: string; // Update to match your `Product` model
  };
  sale_price: number;
}

// =======================================================================

export default function ProductCard1({
  id,
  slug,
  title,
  price,
  imgUrl,
  rating,
  off = 0,
  images,
  shopId,
  shop = { shopName: "Default Shop Name" },
  sale_price,
  ...props
}: ProductCard1Props) {
  const [open, setOpen] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const cartItem = cartItems.find((item) => item.id === id);

  const toggleDialog = useCallback(() => setOpen((open) => !open), []);

  const handleCartAmountChange = (amount: number) => () => {
    if (amount === 0) {
      removeFromCart(id);
    } else {
      addToCart({
        id,
        productId: id,
        name: title,
        price,
        image: imgUrl,
        quantity: amount,
        shopId: shopId,
      });
    }
  };

  const product: Product = {
    id,
    name: title,
    price,
    description: "", // Use a default or placeholder value
    discountPercentage: off,
    sku: 0, // Provide default values if needed
    quantity: 0,
    in_stock: false,
    image: imgUrl,
    gallery: images,
    slug,
    status: ProductStatus.Published,
    product_type: ProductType.Simple,
    createdAt: new Date(),
    updatedAt: new Date(),
    shop,
    sale_price, // Ensure shop is correctly assigned
  };

  return (
    <>
      <Wrapper borderRadius={8} {...props}>
        <div className="image-holder">
          {!!off && (
            <Chip
              top="10px"
              left="10px"
              p="5px 10px"
              fontSize="10px"
              fontWeight="600"
              bg="primary.main"
              position="absolute"
              color="primary.text"
              zIndex={1}
            >
              {off}% off
            </Chip>
          )}

          <FlexBox className="extra-icons">
            <Icon
              color="secondary"
              variant="small"
              mb="0.5rem"
              onClick={toggleDialog}
            >
              eye-alt
            </Icon>

            <Icon className="favorite-icon outlined-icon" variant="small">
              heart
            </Icon>
          </FlexBox>

          <Link href={`/product/${slug}`}>
            <NextImage alt={title} width={277} src={imgUrl} height={270} />
          </Link>
        </div>

        <div className="details">
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
              <Link href={`/product/${slug}`}>
                <H3
                  mb="10px"
                  title={title}
                  fontSize="14px"
                  textAlign="left"
                  fontWeight="600"
                  className="title"
                  color="text.secondary"
                >
                  {title}
                </H3>
                <Typography as="p" text-muted fontSize="12px">
                  Sold by: {shop?.shopName}
                </Typography>{" "}
                {/* Ensure shopName is correctly accessed */}
              </Link>

              <Rating value={rating} outof={5} color="warn" readOnly />

              <FlexBox alignItems="center" mt="10px">
                <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                  {/* {calculateDiscount(price, off)} */}
                  {currency(price)}
                </SemiSpan>

                {!!off && (
                  <SemiSpan fontSize="14px" color="text.muted" fontWeight="500">
                    <del> {currency(sale_price)}</del>
                  </SemiSpan>
                )}
              </FlexBox>
            </Box>

            <FlexBox
              width="30px"
              alignItems="center"
              flexDirection="column-reverse"
              justifyContent={
                !!cartItem?.quantity ? "space-between" : "flex-start"
              }
            >
              <Button
                size="none"
                padding="3px"
                color="primary"
                variant="outlined"
                borderColor="primary.light"
                onClick={handleCartAmountChange((cartItem?.quantity || 0) + 1)}
              >
                <Icon variant="small">plus</Icon>
              </Button>

              {!!cartItem?.quantity && (
                <Fragment>
                  <SemiSpan color="text.primary" fontWeight="600">
                    {cartItem.quantity}
                  </SemiSpan>

                  <Button
                    size="none"
                    padding="3px"
                    color="primary"
                    variant="outlined"
                    borderColor="primary.light"
                    onClick={handleCartAmountChange(cartItem.quantity - 1)}
                  >
                    <Icon variant="small">minus</Icon>
                  </Button>
                </Fragment>
              )}
            </FlexBox>
          </FlexBox>
        </div>
      </Wrapper>

      <ProductQuickView open={open} onClose={toggleDialog} product={product} />
    </>
  );
}
