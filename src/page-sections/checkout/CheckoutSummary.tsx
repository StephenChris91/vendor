"use client";

import { Card1 } from "@component/Card1";
import Divider from "@component/Divider";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import TextField from "@component/text-field";
import Typography from "@component/Typography";
import { useCart } from "hooks/useCart";
import { useState } from "react";

export default function CheckoutSummary() {
  const { cartItems, cartTotal } = useCart();
  const [voucher, setVoucher] = useState("");

  const shipping = 100; // For now, we'll assume free shipping
  const tax = cartTotal * 0.05; // Assuming 5% tax
  const discount = 100; // For now, no discount

  const total = cartTotal + shipping + tax - discount;

  const handleApplyVoucher = () => {
    // Implement voucher logic here
    console.log("Applying voucher:", voucher);
  };

  return (
    <Card1>
      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Subtotal:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            ₦{cartTotal.toFixed(2)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Shipping:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {!shipping ? "Free" : `₦${shipping.toFixed(2)}`}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="0.5rem">
        <Typography color="text.hint">Tax:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            ₦{tax.toFixed(2)}
          </Typography>
        </FlexBox>
      </FlexBox>

      <FlexBox justifyContent="space-between" alignItems="center" mb="1rem">
        <Typography color="text.hint">Discount:</Typography>

        <FlexBox alignItems="flex-end">
          <Typography fontSize="18px" fontWeight="600" lineHeight="1">
            {!discount ? "-" : `₦${discount.toFixed(2)}`}
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
        ₦{total.toFixed(2)}
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
