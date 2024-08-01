import React from "react";
import Avatar from "@component/avatar";
import Box from "@component/Box";
import Rating from "@component/rating";
import FlexBox from "@component/FlexBox";
import { H5, H6, Paragraph } from "@component/Typography";

export type ProductCommentProps = {
  name: string;
  date: string;
  imgUrl: string;
  rating: number;
  comment: string;
};

export default function ProductComment({
  name,
  date,
  imgUrl,
  rating,
  comment,
}: ProductCommentProps) {
  return (
    <Box mb="32px" maxWidth="600px">
      <FlexBox alignItems="center" mb="1rem">
        <Avatar src={imgUrl} size={48} />
        <Box ml="1rem">
          <H5 mb="4px">{name}</H5>
          <FlexBox alignItems="center">
            <Rating value={rating} color="warn" />
            <H6 mx="10px">{rating}</H6>
            <H6 color="text.muted">{date}</H6>
          </FlexBox>
        </Box>
      </FlexBox>

      <Paragraph color="gray.700">{comment}</Paragraph>
    </Box>
  );
}
