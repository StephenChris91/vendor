import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";

import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H5, Paragraph, Tiny } from "@component/Typography";
import { useCart } from "hooks/useCart";
import { currency } from "@utils/utils";
import { StyledMiniCart } from "./styles";

type MiniCartProps = { toggleSidenav?: () => void };

export default function MiniCart({ toggleSidenav = () => {} }: MiniCartProps) {
  const { cartItems, removeFromCart, updateCartItemQuantity, cartTotal } =
    useCart();

  const handleCartAmountChange = (item: any, amount: number) => {
    if (amount < 1) {
      removeFromCart(item.id);
    } else {
      updateCartItemQuantity({ itemId: item.id, quantity: amount });
    }
  };

  return (
    <StyledMiniCart>
      <div className="cart-list">
        <FlexBox alignItems="center" m="0px 20px" height="74px">
          <Icon size="1.75rem">bag</Icon>
          <Typography fontWeight={600} fontSize="16px" ml="0.5rem">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </Typography>
        </FlexBox>

        <Divider />

        {!!!cartItems.length && (
          <FlexBox
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            height="calc(100% - 80px)"
          >
            <Image
              src="/assets/images/logos/shopping-bag.svg"
              width={90}
              height={90}
              alt="vendorspot"
            />
            <Paragraph
              mt="1rem"
              color="text.muted"
              textAlign="center"
              maxWidth="200px"
            >
              Your shopping bag is empty. Start shopping
            </Paragraph>
          </FlexBox>
        )}

        {cartItems.map((item) => (
          <Fragment key={item.id}>
            <div className="cart-item">
              <FlexBox alignItems="center" flexDirection="column">
                <Button
                  size="none"
                  padding="5px"
                  color="primary"
                  variant="outlined"
                  borderRadius="300px"
                  borderColor="primary.light"
                  onClick={() =>
                    handleCartAmountChange(item, item.quantity + 1)
                  }
                >
                  <Icon variant="small">plus</Icon>
                </Button>

                <Typography fontWeight={600} fontSize="15px" my="3px">
                  {item.quantity}
                </Typography>

                <Button
                  size="none"
                  padding="5px"
                  color="primary"
                  variant="outlined"
                  borderRadius="300px"
                  borderColor="primary.light"
                  onClick={() =>
                    handleCartAmountChange(item, item.quantity - 1)
                  }
                  disabled={item.quantity < 0}
                >
                  <Icon variant="small">minus</Icon>
                </Button>
              </FlexBox>

              <Link href={`/product/${item.productId}`}>
                <Avatar
                  size={76}
                  mx="1rem"
                  alt={item.name}
                  src={item.image || "/assets/images/products/iphone-x.png"}
                />
              </Link>

              <div className="product-details">
                <Link href={`/product/${item.productId}`}>
                  <H5 className="title" fontSize="14px">
                    {item.name}
                  </H5>
                </Link>

                <Tiny color="text.muted">
                  {currency(item.price, 0)} x {item.quantity}
                </Tiny>

                <Typography
                  fontWeight={600}
                  fontSize="14px"
                  color="primary.main"
                  mt="4px"
                >
                  {currency(item.quantity * item.price)}
                </Typography>
              </div>

              <Icon
                size="1rem"
                ml="1.25rem"
                className="clear-icon"
                onClick={() => removeFromCart(item.id)} // Direct call to removeFromCart
              >
                close
              </Icon>
            </div>
            <Divider />
          </Fragment>
        ))}
      </div>

      {!!cartItems.length && (
        <div className="actions">
          <Link href="/checkout">
            <Button
              fullwidth
              color="primary"
              variant="contained"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>
                Checkout Now ({currency(cartTotal)})
              </Typography>
            </Button>
          </Link>

          <Link href="/cart">
            <Button
              fullwidth
              color="primary"
              variant="outlined"
              mt="1rem"
              onClick={toggleSidenav}
            >
              <Typography fontWeight={600}>View Cart</Typography>
            </Button>
          </Link>
        </div>
      )}
    </StyledMiniCart>
  );
}
