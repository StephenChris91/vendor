"use client";

import Link from "next/link";
import { Fragment, useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";

import { useCart } from "hooks/useCart";
import { useAuth } from "@context/authContext";

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
import Modal from "@component/Modal";

import { currency, getTheme } from "@utils/utils";
import { deviceSize } from "@utils/constants";
import Product from "@models/product.model";
import { ProductStatus, ProductType } from "@prisma/client";
import { getProductRating, rateProduct } from "actions/products/rating";

// Styled components (keep your existing styled components here)
const ImageWrapper = styled.div`
  width: 230px;
  height: 230px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
`;

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
    id: string;
    shopName: string;
  } | null;
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
  shop = null,
  sale_price,
  ...props
}: ProductCard1Props) {
  const [open, setOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { cartItems, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const cartItem = cartItems.find((item) => item.id === id);
  const [currentRating, setCurrentRating] = useState<number | null>(rating);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRating, setIsLoadingRating] = useState(false);

  const toggleDialog = useCallback(() => setOpen((open) => !open), []);
  const toggleRatingModal = useCallback(
    () => setIsRatingModalOpen((open) => !open),
    []
  );

  const handleRatingClick = () => {
    if (user) {
      toggleRatingModal();
    } else {
      toast.error("Please log in to rate this product");
      // You might want to redirect to login page or open a login modal here
    }
  };

  useEffect(() => {
    let isMounted = true;
    setIsLoadingRating(true);

    const fetchCurrentRating = async () => {
      try {
        const fetchedRating = await getProductRating(id);
        if (isMounted) {
          setCurrentRating(fetchedRating);
        }
      } catch (error) {
        console.error("Error fetching product rating:", error);
        if (isMounted) {
          setCurrentRating(0); // Default to 0 if there's an error
        }
      } finally {
        if (isMounted) {
          setIsLoadingRating(false);
        }
      }
    };

    fetchCurrentRating();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCartAmountChange = (amount: number) => () => {
    if (amount === 0) {
      removeFromCart(id);
      toast.success("Product removed from cart");
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
      toast.success("Product added to cart");
    }
  };

  const handleRatingChange = (newRating: number) => {
    if (user) {
      setIsRatingModalOpen(true);
      setCurrentRating(newRating);
    } else {
      toast.error("Please log in to rate this product");
    }
  };

  // const handleRatingChange = async (newRating: number) => {
  //   if (user) {
  //     setIsLoading(true);
  //     try {
  //       await rateProduct(id, newRating, ""); // Passing an empty string as the comment
  //       const updatedRating = await getProductRating(id);
  //       setCurrentRating(updatedRating);
  //       toast.success("Thank you for rating this product!");
  //       toggleRatingModal();
  //     } catch (error) {
  //       console.error("Error rating product:", error);
  //       toast.error("Failed to submit rating. Please try again.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     toast.error("Please log in to rate this product");
  //     // You might want to redirect to login page or open a login modal here
  //   }
  // };

  const product: Product = {
    id,
    name: title,
    price,
    description: "", // Use a default or placeholder value
    discountPercentage: off,
    sku: 0,
    quantity: 0,
    in_stock: false,
    is_taxable: false,
    status: ProductStatus.Published,
    product_type: ProductType.Simple,
    image: imgUrl,
    ratings: currentRating,
    total_reviews: 0,
    my_review: null,
    in_wishlist: false,
    gallery: images,
    shop_name: shop?.shopName || null,
    stock: 0,
    categories: [],
    shop: shop ? { id: shop.id, shopName: shop.shopName } : null,
    user: null,
    brandId: null,
    isFlashDeal: false,
    slug,
    sale_price,
    createdAt: new Date(),
    updatedAt: new Date(),
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

          <Link href={`/product/${id}`}>
            <ImageWrapper>
              <NextImage
                alt={title}
                src={imgUrl}
                layout="fill"
                objectFit="cover"
              />
            </ImageWrapper>
          </Link>
        </div>

        <div className="details">
          <FlexBox>
            <Box flex="1 1 0" minWidth="0px" mr="0.5rem">
              <Link href={`/product/${id}`}>
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
                  Sold by: {shop ? shop?.shopName : "Unknown"}
                </Typography>
              </Link>

              <FlexBox alignItems="center" mt="10px">
                {isLoadingRating ? (
                  <span>Loading rating...</span>
                ) : (
                  <>
                    <Rating
                      value={currentRating}
                      outof={5}
                      color="warn"
                      onChange={handleRatingChange}
                      readOnly={!user}
                    />
                    <SemiSpan ml="10px">{currentRating.toFixed(1)}</SemiSpan>
                  </>
                )}
              </FlexBox>

              <FlexBox alignItems="center" mt="10px">
                <SemiSpan pr="0.5rem" fontWeight="600" color="primary.main">
                  {currency(price)}
                </SemiSpan>

                {!!off && (
                  <SemiSpan fontSize="14px" color="text.muted" fontWeight="500">
                    <del>{currency(sale_price)}</del>
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

      <Modal open={isRatingModalOpen} onClose={toggleRatingModal}>
        <Card p="2rem">
          <H3 mb="1rem">Rate this product</H3>
          <Rating
            value={currentRating}
            outof={5}
            color="warn"
            onChange={handleRatingChange}
            readOnly={!user || isLoading}
          />
          {!user && (
            <Typography color="error.main" mt="1rem">
              Please log in to rate this product
            </Typography>
          )}
          <Button
            mt="1rem"
            color="primary"
            variant="contained"
            onClick={toggleRatingModal}
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Close"}
          </Button>
        </Card>
      </Modal>
    </>
  );
}
