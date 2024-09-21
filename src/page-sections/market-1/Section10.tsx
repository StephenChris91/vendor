import Link from "next/link";

import Box from "@component/Box";
import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import Container from "@component/Container";
import NextImage from "@component/NextImage";
import Typography from "@component/Typography";
import CategorySectionHeader from "@component/CategorySectionHeader";
import { landingCategories } from "@data/landingCategories";
import FlexBox from "@component/FlexBox";

// Define the type for our category items
type CategoryItem = {
  title: string;
  icon: string;
};

export default function Section10() {
  return (
    <Container mb="70px">
      <CategorySectionHeader
        title="Categories"
        iconName="categories"
        seeMoreLink="#"
      />

      <Grid container spacing={6}>
        {landingCategories.map((item, index) => (
          <Grid item lg={2} md={3} sm={4} xs={12} key={index}>
            <Link href="/" passHref>
              <Card
                as="a"
                hoverEffect
                p="1rem"
                display="block"
                borderRadius={8}
                boxShadow="small"
              >
                <FlexBox alignItems="center">
                  <Box mr="12px" height={50} width={50} position="relative">
                    <NextImage
                      layout="fill"
                      objectFit="contain"
                      alt={item.title}
                      src={item.icon}
                    />
                  </Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {item.title}
                  </Typography>
                </FlexBox>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
