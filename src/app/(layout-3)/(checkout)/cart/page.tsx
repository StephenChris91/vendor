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
import TextField from "@component/text-field";
import { useCart } from "hooks/useCart";
import { currency } from "@utils/utils";
import { useCurrentUser } from "@lib/use-session-client";
import { useShippingRates } from "@hook/useShippingRates";
import { getVendorsFromCart } from "@lib/cartUtils";
import Select from "@component/Select";

const ShippingRates = ({ rates, selectedRate, onSelectRate }) => (
  <Box mt="1rem">
    <Typography fontWeight="600" mb="0.5rem">
      Shipping Rates
    </Typography>
    <Select
      options={rates.map((rate) => ({
        label: `${rate.carrier_name} - ${currency(rate.amount)}`,
        value: rate.carrier_name,
      }))}
      value={
        selectedRate
          ? {
              label: `${selectedRate.carrier_name} - ${currency(
                selectedRate.amount
              )}`,
              value: selectedRate.carrier_name,
            }
          : null
      }
      onChange={(option) => {
        if (option && "value" in option) {
          const selectedRate = rates.find(
            (r) => r.carrier_name === option.value
          );
          if (selectedRate) {
            onSelectRate(selectedRate);
          }
        }
      }}
      placeholder="Select shipping method"
      isMulti={false}
    />
  </Box>
);

export default function Cart() {
  const router = useRouter();
  const {
    cartItems,
    cartTotal,
    updateCartItemQuantity,
    removeFromCart,
    setShippingRate,
    totalWithShipping,
    shippingAddress,
    setShippingAddress,
  } = useCart();
  const user = useCurrentUser();
  const [vendors, setVendors] = useState([]);
  const { aggregatedRates, isLoading, error, getShippingRates } =
    useShippingRates();
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const [selectedAggregatedRate, setSelectedAggregatedRate] = useState(null);

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
    const isComplete = !!(
      shippingAddress?.name &&
      shippingAddress?.street &&
      shippingAddress?.city &&
      shippingAddress?.state &&
      shippingAddress?.zipCode &&
      shippingAddress?.country
    );
    setIsAddressComplete(isComplete);
  }, [shippingAddress]);

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress({
      ...shippingAddress,
      [field]: value,
    });
  };

  const handleSelectRate = (rate) => {
    setSelectedAggregatedRate(rate);
    const vendorIds = vendors.map((v) => v.id);
    vendorIds.forEach((vendorId) => {
      setShippingRate({
        vendorId,
        rate: {
          ...rate,
          amount: rate.vendor_rates[vendorId] || 0,
        },
      });
    });
  };

  const handleGetShippingRates = async () => {
    if (isAddressComplete) {
      try {
        await getShippingRates(user, vendors, shippingAddress);
      } catch (error) {
        console.error("Error getting shipping rates:", error);
      }
    } else {
      alert("Please fill in all address fields");
    }
  };

  const calculatedTotalWithShipping =
    cartTotal + (selectedAggregatedRate ? selectedAggregatedRate.amount : 0);

  if (!user) {
    return null;
  }

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
                {currency(calculatedTotalWithShipping)}
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

            {aggregatedRates.length > 0 ? (
              <ShippingRates
                rates={aggregatedRates}
                selectedRate={selectedAggregatedRate}
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
                  !selectedAggregatedRate
                }
              >
                Proceed to Checkout ({currency(calculatedTotalWithShipping)})
              </Button>
            </Link>
          </Card1>
        </Grid>
      </Grid>
    </Fragment>
  );
}
