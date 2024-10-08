"use client";

import Box from "@component/Box";
import Rating from "@component/rating";
import Avatar from "@component/avatar";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H3, SemiSpan, Small } from "@component/Typography";
import { ShopIntroWrapper } from "./styles";
import Shop from "@models/shop.model";

type Props = { shop: Shop };
export default function ShopIntroCard({ shop }: Props) {
  return (
    <ShopIntroWrapper mb="32px" pb="20px" overflow="hidden">
      <Box
        style={{
          backgroundImage: `url(${shop.banner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          objectFit: "cover",
        }}
        height="202px"
      />

      <FlexBox mt="-64px" px="30px" flexWrap="wrap">
        <Avatar
          size={120}
          mr="37px"
          border="4px solid"
          borderColor="gray.100"
          src={shop?.logo || "/assets/images/faces/propic.png"}
        />

        <div className="description-holder">
          <FlexBox
            mt="3px"
            mb="22px"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              my="8px"
              p="4px 16px"
              borderRadius="4px"
              bg="secondary.main"
              display="inline-block"
            >
              <H3 fontWeight="600" color="primary">
                {shop?.shopName}
              </H3>
            </Box>

            {/* <FlexBox my="8px">
              {socialLinks.map((item, ind) => (
                <a
                  key={ind}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon
                    size="30px"
                    defaultcolor="auto"
                    mr={ind < socialLinks.length - 1 ? "10px" : ""}
                  >{`${item.name}_filled`}</Icon>
                </a>
              ))}
            </FlexBox> */}
          </FlexBox>

          <FlexBox
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
          >
            <div>
              <FlexBox alignItems="center" mb="14px">
                <Rating color="warn" value={5} outof={5} readOnly />

                <Small color="text.muted" pl="0.75rem" display="block">
                  (45)
                </Small>
              </FlexBox>

              {/* <FlexBox color="text.muted" mb="8px" maxWidth="270px">
                <Icon defaultcolor="currentColor" size="15px" mt="5px">
                  map-pin-2
                </Icon>

                <SemiSpan color="text.muted" ml="12px">
                  {shop?.address?.street}
                </SemiSpan>
              </FlexBox>

              <FlexBox color="text.muted" mb="8px">
                <Icon defaultcolor="currentColor" size="15px" mt="4px">
                  phone_filled
                </Icon>

                <SemiSpan color="text.muted" ml="12px">
                  {shop?.shopSettings.businessHours}
                </SemiSpan>
              </FlexBox> */}
            </div>

            <a>
              <Button variant="outlined" color="primary" my="12px">
                Contact Vendor
              </Button>
            </a>
          </FlexBox>
        </div>
      </FlexBox>
    </ShopIntroWrapper>
  );
}

const socialLinks = [
  { name: "facebook", url: "https://facebook.com" },
  { name: "twitter", url: "https://twitter.com" },
  { name: "youtube", url: "https://youtube.com" },
  { name: "instagram", url: "https://instagram.com" },
];
