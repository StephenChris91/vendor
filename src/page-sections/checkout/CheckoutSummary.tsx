import React, { useEffect, useState } from "react";
import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography from "@component/Typography";
import { useCart } from "hooks/useCart";
import { useShippingRates } from "hooks/useShippingRates";
import Select, { SelectOption } from "@component/Select";
import { useCurrentUser } from "@lib/use-session-client";
import { ShippingRate } from "../../store/cartStore";
import { currency } from "@utils/utils";

export default function CheckoutSummary() {
  const {
    cartItems,
    cartTotal,
    selectedShippingRates,
    setShippingRate,
    shippingAddress,
    getVendorIds,
  } = useCart();
  const {
    individualRates,
    aggregatedRates,
    isLoading,
    error,
    getShippingRates,
  } = useShippingRates();
  const [voucher, setVoucher] = useState("");
  const user = useCurrentUser();

  useEffect(() => {
    if (user && shippingAddress && cartItems.length > 0) {
      const vendors = getVendorIds().map((id) => ({ id }));
      getShippingRates(user, vendors, shippingAddress);
    }
  }, [user, shippingAddress, cartItems, getVendorIds, getShippingRates]);

  const handleShippingRateChange = (option: SelectOption | null) => {
    if (option) {
      const selectedAggregatedRate = aggregatedRates.find(
        (r) => r.carrier_name === option.value
      );
      if (selectedAggregatedRate) {
        Object.entries(selectedAggregatedRate.vendor_rates).forEach(
          ([vendorId, amount]) => {
            const vendorRate = individualRates.find(
              (r) =>
                r.vendorId === vendorId &&
                r.carrier_name === selectedAggregatedRate.carrier_name
            );
            if (vendorRate) {
              setShippingRate({
                vendorId,
                rate: vendorRate,
              });
            }
          }
        );
      }
    }
  };

  const getShippingOptions = (): SelectOption[] => {
    return aggregatedRates.map((rate) => ({
      label: `${rate.carrier_name} - ${currency(rate.amount)}`,
      value: rate.carrier_name,
    }));
  };

  const getSelectedOption = (): SelectOption | null => {
    const selectedRates = Object.values(selectedShippingRates);
    if (selectedRates.length > 0) {
      const carrierName = selectedRates[0].carrier_name;
      const totalAmount = selectedRates.reduce(
        (sum, rate) => sum + (rate.amount || 0),
        0
      );
      return {
        label: `${carrierName} - ${currency(totalAmount)}`,
        value: carrierName,
      };
    }
    return null;
  };

  const calculateTotalShipping = () => {
    return Object.values(selectedShippingRates).reduce(
      (sum, rate) => sum + (rate.amount || 0),
      0
    );
  };

  const shipping = calculateTotalShipping();
  const tax = ((cartTotal || 0) + shipping) * 0.05; // Assuming 5% tax
  const discount = 0; // You can implement discount logic here
  const total = (cartTotal || 0) + shipping + tax - discount;

  const handleApplyVoucher = () => {
    console.log("Applying voucher:", voucher);
    // Implement voucher logic here
  };

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>
        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(cartTotal || 0)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <Typography color="text.hint" mb="0.5rem">
        Shipping:
      </Typography>
      {isLoading ? (
        <Typography>Loading rates...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
          <Typography>Select shipping method:</Typography>
          <Select
            options={getShippingOptions()}
            value={getSelectedOption()}
            onChange={(option) =>
              handleShippingRateChange(option as SelectOption)
            }
            placeholder="Select shipping method"
            isSearchable={false}
          />
        </FlexBox>
      )}

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Shipping:</Typography>
        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(shipping)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Tax (5%):</Typography>
        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {currency(tax)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
        <Typography color="text.hint">Discount:</Typography>
        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {discount > 0 ? currency(discount) : "-"}
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
