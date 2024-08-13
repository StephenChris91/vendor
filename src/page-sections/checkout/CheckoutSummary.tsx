"use client";

import { useEffect, useState } from "react";
import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography from "@component/Typography";
import { useCart } from "hooks/useCart";
import { useShippingRates } from "hooks/useShippingRates";
import Select, { SelectOption } from "@component/Select";
import { currency } from "@utils/utils";
import { useCurrentUser } from "@lib/use-session-client";

export default function CheckoutSummary() {
  const {
    cartItems,
    cartTotal,
    selectedShippingRate,
    setShippingRate,
    shippingAddress,
    totalWithShipping,
  } = useCart();
  const { shippingRates, isLoading, error, getShippingRates } =
    useShippingRates();
  const user = useCurrentUser();

  const [voucher, setVoucher] = useState("");

  useEffect(() => {
    if (
      user &&
      shippingAddress &&
      cartItems.length > 0 &&
      !selectedShippingRate
    ) {
      const vendors = cartItems.map((item) => ({ id: item.shopId }));
      getShippingRates(user, vendors, shippingAddress);
    }
  }, [
    user,
    shippingAddress,
    cartItems,
    getShippingRates,
    selectedShippingRate,
  ]);

  const tax = totalWithShipping * 0.05;
  const total = totalWithShipping + tax;

  const handleShippingRateChange = (option: SelectOption | null) => {
    if (option) {
      const selectedRate = shippingRates.find(
        (rate) => rate.carrier_name === option.value
      );
      if (selectedRate) {
        setShippingRate(selectedRate);
      }
    }
  };

  const handleApplyVoucher = () => {
    console.log("handleApplyVoucher");
  };

  const shippingOptions: SelectOption[] = shippingRates.map((rate) => ({
    label: `${rate.carrier_name} - ${currency(rate.amount)}`,
    value: rate.carrier_name,
  }));

  const selectedOption: SelectOption | null = selectedShippingRate
    ? {
        label: `${selectedShippingRate.carrier_name} - ${currency(
          selectedShippingRate.amount
        )}`,
        value: selectedShippingRate.carrier_name,
      }
    : null;

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>
        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(cartTotal)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Shipping:</Typography>
        {isLoading ? (
          <Typography>Loading rates...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : selectedShippingRate ? (
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(selectedShippingRate.amount)}
            {/* {selectedShippingRate.carrier_name}) */}
          </Typography>
        ) : shippingRates.length > 0 ? (
          <Select
            options={shippingOptions}
            value={selectedOption}
            onChange={handleShippingRateChange}
            placeholder="Select shipping method"
          />
        ) : (
          <Typography>No shipping rates available</Typography>
        )}
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Tax (5%):</Typography>
        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(tax)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <Divider mb="1rem" />

      <Typography
        fontSize="25px"
        fontWeight="600"
        lineHeight="1"
        textAlign="right"
        mb="1.5rem"
      >
        {currency(total)}
      </Typography>

      <TextField
        placeholder="Voucher"
        fullwidth
        value={voucher}
        onChange={(e) => setVoucher(e.target.value)}
      />

      <Button
        variant="outlined"
        color="primary"
        mt="1rem"
        mb="30px"
        fullwidth
        onClick={handleApplyVoucher}
      >
        Apply Voucher
      </Button>
    </Card1>
  );
}
