"use client";
import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography from "@component/Typography";
import { ProductCard7 } from "@component/product-cards";
import Select from "@component/Select";
import TextField from "@component/text-field";
import { useCart } from "hooks/useCart";
import { currency } from "@utils/utils";
import stateList from "@data/stateList";
import { useCurrentUser } from "@lib/use-session-client";
import { useShippingRates } from "@hook/useShippingRates";
import { getVendorsFromCart } from "@lib/cartUtils";

const ShippingRates = ({ rates, selectedRate, onSelectRate }) => (
  <Box mt="1rem">
    <Typography fontWeight="600" mb="0.5rem">
      Shipping Rates
    </Typography>
    {rates.map((rate) => (
      <Box key={rate.carrier_name + rate.amount} mb="0.5rem">
        <input
          type="radio"
          id={rate.carrier_name}
          name="shippingRate"
          value={rate.amount}
          checked={
            selectedRate && selectedRate.carrier_name === rate.carrier_name
          }
          onChange={() => onSelectRate(rate)}
        />
        <label htmlFor={rate.carrier_name}>
          {rate.carrier_name} - {currency(rate.amount)}
        </label>
      </Box>
    ))}
  </Box>
);

export default function Cart() {
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
    selectedShippingRate,
    setShippingRate,
    fallbackShippingRate,
    totalWithShipping,
    shippingAddress,
    setShippingAddress,
  } = useCart();
  const user = useCurrentUser();
  const [vendors, setVendors] = useState([]);
  const { shippingRates, isLoading, error, getShippingRates } =
    useShippingRates();
  const [isAddressComplete, setIsAddressComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchVendors() {
      if (user && cartItems.length > 0) {
        try {
          const fetchedVendors = await getVendorsFromCart(cartItems);
          setVendors(fetchedVendors);
        } catch (error) {
          console.error("Error fetching vendors:", error);
        }
      }
    }

    fetchVendors();
  }, [user, cartItems]);

  useEffect(() => {
    // Check if all required fields of shipping address are filled
    const isComplete = !!(
      shippingAddress?.name &&
      shippingAddress?.street &&
      shippingAddress?.city &&
      shippingAddress?.state &&
      shippingAddress?.zipCode &&
      shippingAddress?.country
    );
    setIsAddressComplete(isComplete);
    console.log("Shipping address:", shippingAddress);
    console.log("Is address complete:", isComplete);
  }, [shippingAddress]);

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress({
      ...shippingAddress,
      [field]: value,
    });
  };

  const handleSelectRate = (rate) => {
    setShippingRate(rate);
  };

  const handleGetShippingRates = async () => {
    if (
      shippingAddress?.state &&
      shippingAddress?.city &&
      shippingAddress?.street
    ) {
      try {
        console.log("Sending address:", shippingAddress);
        console.log("Vendors:", vendors);
        await getShippingRates(user, vendors, shippingAddress);
        console.log("Shipping rates fetched successfully");
      } catch (error) {
        console.error("Error getting shipping rates:", error);
      }
    } else {
      alert("Please fill in all address fields");
    }
  };

  if (!user) {
    return null;
  }

  // if (cartItems.length === 0) {
  //   return (
  //     <Box mt="2rem" mb="2rem">
  //       <Typography color="gray.600" mb="1rem">
  //         Your cart is empty.
  //       </Typography>
  //       <Link href="/">
  //         <Button size="small" variant="contained">
  //           <Link href="/shop">Continue Shopping</Link>
  //         </Button>
  //       </Link>
  //     </Box>
  //   );
  // }

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          {cartItems.map((item) => (
            <ProductCard7
              mb="1.5rem"
              id={item.id}
              key={item.id}
              quantity={item.quantity}
              slug={item.productId}
              name={item.name}
              price={item.price}
              imgUrl={item.image}
              onQuantityChange={(newQuantity) =>
                updateCartItemQuantity({
                  itemId: item.id,
                  quantity: newQuantity,
                })
              }
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <Card1>
            <FlexBox
              justifyContent="space-between"
              alignItems="center"
              mb="1rem"
            >
              <Typography color="gray.600">Total:</Typography>
              <Typography fontSize="18px" fontWeight="600" lineHeight="1">
                {currency(totalWithShipping)}
              </Typography>
            </FlexBox>

            <Divider mb="1rem" />

            <Typography fontWeight="600" mb="1rem">
              Shipping Information
            </Typography>

            <TextField
              fullwidth
              mb={2}
              label="Full Name"
              value={shippingAddress?.name || ""}
              onChange={(e) => handleAddressChange("name", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="Street Address"
              value={shippingAddress?.street || ""}
              onChange={(e) => handleAddressChange("street", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="City"
              value={shippingAddress?.city || ""}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="State"
              value={shippingAddress?.state || ""}
              onChange={(e) => handleAddressChange("state", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="Zip Code"
              value={shippingAddress?.zipCode || ""}
              onChange={(e) => handleAddressChange("zipCode", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="Country"
              value={shippingAddress?.country || ""}
              onChange={(e) => handleAddressChange("country", e.target.value)}
            />

            <Button
              variant="outlined"
              color="primary"
              fullwidth
              onClick={handleGetShippingRates}
              disabled={isLoading || !isAddressComplete}
            >
              {isLoading ? "Calculating..." : "Calculate Shipping"}
            </Button>

            {error && (
              <Typography mt="1rem" color="error.main">
                {error}
              </Typography>
            )}

            {shippingRates.length > 0 ? (
              <ShippingRates
                rates={[...shippingRates, fallbackShippingRate]}
                selectedRate={selectedShippingRate || fallbackShippingRate}
                onSelectRate={handleSelectRate}
              />
            ) : (
              <Typography mt="1rem">
                {isLoading
                  ? "Fetching shipping rates..."
                  : "No shipping rates available"}
              </Typography>
            )}

            <Divider my="1rem" />

            <Link href="/checkout" passHref>
              <Button
                variant="contained"
                color="primary"
                fullwidth
                disabled={
                  !isAddressComplete ||
                  cartItems.length === 0 ||
                  !selectedShippingRate
                }
              >
                Proceed to Checkout ({currency(totalWithShipping)})
              </Button>
            </Link>
          </Card1>
        </Grid>
      </Grid>
    </Fragment>
  );
}
