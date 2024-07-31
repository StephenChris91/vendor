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
import { useAppContext } from "@context/app-context";
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
  const { state } = useAppContext();
  const user = useCurrentUser();
  const [selectedRate, setSelectedRate] = useState(null);
  const [vendors, setVendors] = useState([]);
  const { shippingRates, isLoading, error, getShippingRates } =
    useShippingRates();
  const [address, setAddress] = useState({
    country: { label: "Nigeria", value: "NG" },
    state: null,
    city: "",
    street: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, router]);

  useEffect(() => {
    async function fetchVendors() {
      if (user && state.cart.length > 0) {
        try {
          const fetchedVendors = await getVendorsFromCart(state.cart);
          setVendors(fetchedVendors);
        } catch (error) {
          console.error("Error fetching vendors:", error);
          // Handle error (e.g., show error message to user)
        }
      }
    }

    fetchVendors();
  }, [user, state.cart]);

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectRate = (rate) => {
    setSelectedRate(rate);
  };

  const handleGetShippingRates = async () => {
    if (address.state && address.city && address.street) {
      try {
        await getShippingRates(user, state.cart, vendors, address);
        console.log("Shipping rates fetched successfully");
      } catch (error) {
        console.error("Error getting shipping rates:", error);
        // Handle error (e.g., show error message to user)
      }
    } else {
      alert("Please fill in all address fields");
    }
  };

  const getTotalPrice = () => {
    const itemsTotal = state.cart.reduce(
      (accumulator, item) => accumulator + item.price * item.qty,
      0
    );
    const shippingCost = selectedRate ? selectedRate.amount : 0;
    return itemsTotal + shippingCost;
  };

  if (!user) {
    return null; // The useEffect hook will redirect to login
  }

  return (
    <Fragment>
      <Grid container spacing={6}>
        <Grid item lg={8} md={8} xs={12}>
          {state.cart.map((item) => (
            <ProductCard7
              mb="1.5rem"
              id={item.id}
              key={item.id}
              qty={item.qty}
              slug={item.slug}
              name={item.name}
              price={item.price}
              imgUrl={item.imgUrl}
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
                {currency(getTotalPrice())}
              </Typography>
            </FlexBox>

            <Divider mb="1rem" />

            <Typography fontWeight="600" mb="1rem">
              Shipping Information
            </Typography>

            <Select
              mb="1rem"
              label="Country"
              options={[{ label: "Nigeria", value: "NG" }]}
              value={address.country}
              onChange={(option) => handleAddressChange("country", option)}
            />

            <Select
              mb="1rem"
              label="State"
              options={stateList.map((state) => ({
                label: state.label,
                value: state.value,
              }))}
              placeholder="Select State"
              value={address.state}
              onChange={(option) => handleAddressChange("state", option)}
            />

            <TextField
              mb="1rem"
              label="City"
              placeholder="Enter City"
              fullwidth
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
            />

            <TextField
              mb="1rem"
              label="Street Address"
              placeholder="Enter Street Address"
              fullwidth
              value={address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
            />

            <Button
              variant="outlined"
              color="primary"
              fullwidth
              onClick={handleGetShippingRates}
              disabled={isLoading}
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
                rates={shippingRates}
                selectedRate={selectedRate}
                onSelectRate={handleSelectRate}
              />
            ) : (
              <Typography mt="1rem">No shipping rates available</Typography>
            )}

            <Divider my="1rem" />

            <Link href="/checkout">
              <Button
                variant="contained"
                color="primary"
                fullwidth
                disabled={!selectedRate}
              >
                Checkout Now
              </Button>
            </Link>
          </Card1>
        </Grid>
      </Grid>
    </Fragment>
  );
}
