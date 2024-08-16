"use client";

import Link from "next/link";
import { FC, useState, Fragment } from "react";
import styled from "styled-components";

import Box from "@component/Box";
import Rating from "@component/rating";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import NextImage from "@component/NextImage";
import { IconButton } from "@component/buttons";
import { H4, Paragraph, Small } from "@component/Typography";
import ProductQuickView from "@component/products/ProductQuickView";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";
import { theme } from "@utils/theme";
import Product from "@models/product.model";
import { ProductStatus, ProductType } from "@prisma/client";

// styled components
const CardBox = styled(Box)({
  borderRadius: "3px",
  transition: "all 0.3s",
  backgroundColor: "white",
  border: `1px solid ${theme.colors.gray[100]}`,
  "&:hover": {
    border: "1px solid #000",
    "& .product-actions": { right: 5 },
    "& .product-img": { transform: "scale(1.1)" },
  },
});

const CardMedia = styled(Box)({
  width: "100%",
  maxHeight: 300,
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  "& .product-img": { transition: "0.3s" },
});

const AddToCartButton = styled(IconButton)({
  top: 10,
  right: -40,
  position: "absolute",
  transition: "right 0.3s .1s",
  background: "transparent",
});

const FavoriteButton = styled(IconButton)({
  top: 45,
  right: -40,
  position: "absolute",
  background: "transparent",
  transition: "right 0.3s .2s",
});

// ==============================================================
type ProductCard19Props = {
  img: string;
  name: string;
  slug: string;
  price: number;
  reviews: number;
  images: string[];
  id: string;
};
// ==============================================================

export default function ProductCard19(props: ProductCard19Props) {
  const { img, name, price, reviews, id, slug, images } = props;
  const [open, setOpen] = useState(false);

  const { state, dispatch } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = state.cart.find((item) => item.slug === slug);

  // handle favorite
  const handleFavorite = () => setIsFavorite((fav) => !fav);

  //   handle modal
  const toggleDialog = () => setOpenDialog((state) => !state);

  // handle add to cart
  const handleAddToCart = () => {
    const payload = {
      id,
      slug,
      name,
      price,
      imgUrl: img,
      qty: (cartItem?.qty || 0) + 1,
    };

    dispatch({ type: "CHANGE_CART_AMOUNT", payload });
  };

  // Provide all required properties here
  const product: Product = {
    id,
    name: null,
    slug,
    description: "", // Provide an actual description if available
    price,
    sale_price: price, // Use the same price if no sale price is available
    sku: 0, // Provide an actual SKU if available
    quantity: 0, // Provide an actual quantity if available
    in_stock: true, // Assume it's in stock, or provide actual value if available
    is_taxable: false, // Provide actual value if available
    status: ProductStatus.Published,
    product_type: ProductType.Simple,
    image: null,
    ratings: null,
    total_reviews: 0, // Provide actual value if available
    my_review: null,
    in_wishlist: false, // Provide actual value if available
    gallery: images,
    shop_name: null, // Provide actual shop name if available
    stock: 0, // Provide actual stock if available
    categories: [], // Provide actual categories if available
    shop: null, // Provide actual shop data if available
    user: null, // Provide actual user data if available
    brandId: null, // Provide actual brand ID if available
    isFlashDeal: false, // Provide actual value if available
    discountPercentage: null,
  };

  return (
    <Fragment>
      <CardBox height="100%">
        <CardMedia>
          <Link href={`/product/${slug}`}>
            <NextImage
              src={img}
              width={300}
              height={300}
              alt="category"
              className="product-img"
            />
          </Link>

          <AddToCartButton
            className="product-actions"
            onClick={() => setOpenDialog(true)}
          >
            <Icon size="18px">eye</Icon>
          </AddToCartButton>

          <FavoriteButton className="product-actions" onClick={handleFavorite}>
            {isFavorite ? (
              <Icon size="18px">heart-filled</Icon>
            ) : (
              <Icon size="18px">heart</Icon>
            )}
          </FavoriteButton>
        </CardMedia>

        <Box p={2} textAlign="center">
          <Paragraph>{name}</Paragraph>
          <H4 fontWeight={700} py=".5rem">
            {currency(price)}
          </H4>

          <FlexBox justifyContent="center" alignItems="center" mb="1rem">
            <Rating value={4} color="warn" size="small" />
            <Small fontWeight={600} color="gray.500" ml=".3rem">
              ({reviews})
            </Small>
          </FlexBox>

          <Button
            fullwidth
            color="dark"
            variant="outlined"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        </Box>
      </CardBox>

      {/* QUICK VIEW MODAL */}
      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={product} // Pass the full product object
      />
    </Fragment>
  );
}
