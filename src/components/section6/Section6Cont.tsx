// components/Section6Content.tsx
import Box from "@component/Box";
import Hidden from "@component/hidden";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import Container from "@component/Container";
import { ProductCard1 } from "@component/product-cards";
import SkeletonGrid from "@component/skeleton/SkeletonProducts";
import Typography from "@component/Typography";
import StyledProductCategory from "@sections/market-1/styled";

export default function Section6Content({
  oldestShops,
  isLoadingShops,
  displayProducts,
  isLoadingProducts,
  selected,
  handleShopClick,
}) {
  if (isLoadingShops) {
    return (
      <Container mb="80px">
        <SkeletonGrid count={5} />
      </Container>
    );
  }

  return (
    <Container mb="80px">
      <FlexBox>
        <Hidden down={768} mr="1.75rem">
          <Box shadow={6} borderRadius={10} padding="1.25rem" bg="white">
            <Typography as="h1" mb="1rem" fontSize="24px" fontWeight="bold">
              Featured Shops
            </Typography>
            {oldestShops?.map((shop) => (
              <StyledProductCategory
                mb="0.75rem"
                key={shop.id}
                onClick={handleShopClick(shop.id)}
                shadow={selected === shop.id ? 4 : null}
                bg={selected === shop.id ? "white" : "gray.100"}
              >
                <span className="product-category-title">{shop?.shopName}</span>
              </StyledProductCategory>
            ))}
          </Box>
        </Hidden>

        <Box flex="1 1 0" minWidth="0px">
          {isLoadingProducts ? (
            <SkeletonGrid count={8} />
          ) : (
            <Grid container spacing={6}>
              {displayProducts && displayProducts.length > 0 ? (
                displayProducts.map((item, ind) => (
                  <Grid item lg={4} sm={6} xs={12} key={ind}>
                    <ProductCard1
                      hoverEffect
                      id={item.id}
                      slug={item.slug}
                      title={item.name}
                      price={item.price}
                      off={item.discountPercentage}
                      rating={item.ratings || 0}
                      images={item.gallery}
                      imgUrl={item.image}
                      shop={item.shop}
                      shopId={item.shop?.id}
                      sale_price={item.sale_price}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box textAlign="center" py={3}>
                    {selected
                      ? "No products found for this shop."
                      : "No products available."}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </FlexBox>
    </Container>
  );
}
