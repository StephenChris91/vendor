import Card from "@component/Card";
import Grid from "@component/grid/Grid";
import ProductCard2 from "@component/product-cards/ProductCard2";
import CategorySectionCreator from "@component/CategorySectionCreator";
import Product from "@models/product.model";

// =======================================================
type Props = { newArrivalsList: Product[] };
// =======================================================

export default function Section5({ newArrivalsList }: Props) {
  return (
    <CategorySectionCreator
      iconName="new-product-1"
      title="New Arrivals"
      seeMoreLink="#"
    >
      <Card p="1rem" borderRadius={8}>
        <Grid container spacing={6}>
          {newArrivalsList.map((item) => (
            <Grid item lg={2} md={3} sm={4} xs={6} key={item.name}>
              <ProductCard2
                slug={item.slug}
                title={item.name}
                price={item.price}
                imgUrl={item.image}
              />
            </Grid>
          ))}
        </Grid>
      </Card>
    </CategorySectionCreator>
  );
}
