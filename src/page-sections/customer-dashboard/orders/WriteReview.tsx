"use client";

import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import Typography, { H6 } from "@component/Typography";
import { OrderItem } from "@models/order.model";

type WriteReviewProps = {
  item: OrderItem;
};

export default function WriteReview({ item }: WriteReviewProps) {
  return (
    <FlexBox px="1rem" py="0.5rem" flexWrap="wrap" alignItems="center">
      <FlexBox flex="2 2 260px" m="6px" alignItems="center">
        <Box>
          <H6 my="0px">Product ID: {item.productId}</H6>
          <Typography fontSize="14px" color="text.muted">
            Quantity: {item.quantity}
          </Typography>
        </Box>
      </FlexBox>

      <FlexBox flex="1 1 260px" m="6px" alignItems="center">
        <Typography fontSize="14px" color="text.muted">
          Order Item ID: {item.id}
        </Typography>
      </FlexBox>

      <FlexBox flex="160px" m="6px" alignItems="center">
        <Button variant="text" color="primary">
          <Typography fontSize="14px">Write a Review</Typography>
        </Button>
      </FlexBox>
    </FlexBox>
  );
}
