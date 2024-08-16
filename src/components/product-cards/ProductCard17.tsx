"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
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
const Wrapper = styled(Box)({
  "&:hover": {
    "& .product-actions": { right: 10 },
    "& img": { transform: "scale(1.1)" },
    "& .product-view-action": { opacity: 1 },
  },
});

const CardMedia = styled(Box)({
  maxHeight: 300,
  cursor: "pointer",
  overflow: "hidden",
  position: "relative",
  backgroundColor: theme.colors.gray[300],
  "& img": { transition: "0.3s" },
});

const AddToCartButton = styled(IconButton)({
  top: 10,
  right: -40,
  position: "absolute",
  transition: "right 0.3s .1s",
  backgroundColor: "transparent",
});

const FavoriteButton = styled(IconButton)({
  top: 45,
  right: -40,
  position: "absolute",
  transition: "right 0.3s .2s",
  backgroundColor: "transparent",
});

const QuickViewButton = styled(Button)({
  left: 0,
  bottom: 0,
  opacity: 0,
  width: "100%",
  color: "white",
  borderRadius: 0,
  position: "absolute",
  transition: "all 0.3s",
  backgroundColor: theme.colors.secondary.main,
});

// ==============================================================
type ProductCard17Props = {
  slug: string;
  title: string;
  price: number;
  imgUrl: string;
  rating?: number;
  reviews: number;
  category: string;
  images: string[];
  id: string;
};

// ==============================================================

export default function ProductCard17(props: ProductCard17Props) {
  const { id, title, price, imgUrl, category, reviews, slug, images } = props;
  const [open, setOpen] = useState(false);

  const { state, dispatch } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const cartItem = state.cart.find((item) => item.slug === slug);

  const handleFavorite = () => setIsFavorite((fav) => !fav);
  const toggleDialog = useCallback(() => setOpenDialog((open) => !open), []);

  // handle add to cart
  const handleAddToCart = () => {
    const payload = {
      id,
      slug,
      price,
      imgUrl,
      name: title,
      qty: (cartItem?.qty || 0) + 1,
    };

    dispatch({ type: "CHANGE_CART_AMOUNT", payload });
  };

  // Provide all required properties here
  const product: Product = {
    id,
    name: title,
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
    image: imgUrl,
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
    <Wrapper>
      <CardMedia>
        <Link href={`/product/${slug}`}>
          <NextImage
            width={300}
            height={300}
            src={imgUrl}
            alt="category"
            className="product-img"
          />
        </Link>

        <AddToCartButton className="product-actions" onClick={handleAddToCart}>
          <Icon size="18px">shopping-cart</Icon>
        </AddToCartButton>

        <FavoriteButton className="product-actions" onClick={handleFavorite}>
          <Icon size="18px">{isFavorite ? "heart-filled" : "heart"}</Icon>
        </FavoriteButton>

        <QuickViewButton
          size="large"
          variant="contained"
          className="product-view-action"
          onClick={() => setOpenDialog(true)}
        >
          Quick View
        </QuickViewButton>
      </CardMedia>

      <ProductQuickView
        open={open}
        onClose={toggleDialog}
        product={product} // Pass the full product object
      />

      <Box p={1} textAlign="center">
        <Small color="gray.500">{category}</Small>
        <Paragraph fontWeight="bold">{title}</Paragraph>
        <H4 fontWeight={700} py={0.5}>
          {currency(price)}
        </H4>

        <FlexBox alignItems="center" justifyContent="center">
          <Rating value={4} color="warn" />
          <Small fontWeight={600} color="gray.500" ml=".5rem">
            ({reviews} Reviews)
          </Small>
        </FlexBox>
      </Box>
    </Wrapper>
  );
}
