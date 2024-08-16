"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import Box from "@component/Box";
import Image from "@component/Image";
import Rating from "@component/rating";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H1, H2, H3, H6, SemiSpan } from "@component/Typography";
import { useAppContext } from "@context/app-context";
import { currency } from "@utils/utils";
import { useCart } from "@hook/useCart";
import Product from "@models/product.model";

// ========================================
type ProductIntroProps = {
  product: Product;
};
// ========================================

export default function ProductIntro({ product }: ProductIntroProps) {
  const { id, name, price, image, gallery, shop } = product;
  const [selectedImage, setSelectedImage] = useState(0);
  const { cartItems, addToCart, removeFromCart } = useCart();

  const cartItem = cartItems.find((item) => item.productId === id);

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const handleCartAmountChange = (amount: number) => () => {
    if (amount === 0) {
      removeFromCart(id);
    } else {
      addToCart({
        id,
        productId: product.id,
        name,
        price,
        image: image || "",
        quantity: amount,
        shopId: product.shop.id,
      });
    }
  };

  return (
    <Box overflow="hidden">
      <Grid container justifyContent="center" spacing={16}>
        <Grid item md={6} xs={12} alignItems="center">
          <div>
            <FlexBox
              mb="50px"
              overflow="hidden"
              borderRadius={16}
              justifyContent="center"
            >
              <Image
                width={300}
                height={300}
                src={image || ""}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </FlexBox>

            <FlexBox overflow="auto">
              {gallery?.map((url, ind) => (
                <Box
                  key={ind}
                  size={70}
                  bg="white"
                  minWidth={70}
                  display="flex"
                  cursor="pointer"
                  border="1px solid"
                  borderRadius="10px"
                  alignItems="center"
                  justifyContent="center"
                  ml={ind === 0 ? "auto" : ""}
                  mr={ind === gallery.length - 1 ? "auto" : "10px"}
                  borderColor={
                    selectedImage === ind ? "primary.main" : "gray.400"
                  }
                  onClick={handleImageClick(ind)}
                >
                  <Avatar src={url} borderRadius="10px" size={65} />
                </Box>
              ))}
            </FlexBox>
          </div>
        </Grid>

        <Grid item md={6} xs={12} alignItems="center">
          <H1 mb="1rem">{name}</H1>

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Brand:</SemiSpan>
            <H6 ml="8px">{product.brandId || "N/A"}</H6>
          </FlexBox>

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Rated:</SemiSpan>
            <Box ml="8px" mr="8px">
              <Rating color="warn" value={product.ratings || 0} outof={5} />
            </Box>
            <H6>({product.total_reviews || 0})</H6>
          </FlexBox>

          <Box mb="24px">
            <H2 color="primary.main" mb="4px" lineHeight="1">
              {currency(price)}
            </H2>

            <SemiSpan color="inherit">
              {product.in_stock ? "Stock Available" : "Out of Stock"}:{" "}
              {product.stock}
            </SemiSpan>
          </Box>

          {!cartItem?.quantity ? (
            <Button
              mb="36px"
              size="small"
              color="primary"
              variant="contained"
              onClick={handleCartAmountChange(1)}
              disabled={!product.in_stock}
            >
              Add to Cart
            </Button>
          ) : (
            <FlexBox alignItems="center" mb="36px">
              <Button
                p="9px"
                size="small"
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem.quantity - 1)}
              >
                <Icon variant="small">minus</Icon>
              </Button>

              <H3 fontWeight="600" mx="20px">
                {cartItem.quantity.toString().padStart(2, "0")}
              </H3>

              <Button
                p="9px"
                size="small"
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem.quantity + 1)}
                disabled={cartItem.quantity >= (product.stock || 0)}
              >
                <Icon variant="small">plus</Icon>
              </Button>
            </FlexBox>
          )}

          <FlexBox alignItems="center" mb="1rem">
            <SemiSpan>Sold By:</SemiSpan>
            {shop ? (
              <Link href={`/shops/${shop.id}`}>
                <H6 lineHeight="1" ml="8px">
                  {shop?.shopName}
                </H6>
              </Link>
            ) : (
              <H6 lineHeight="1" ml="8px">
                N/A
              </H6>
            )}
          </FlexBox>
        </Grid>
      </Grid>
    </Box>
  );
}
