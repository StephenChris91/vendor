import Typography, { H3 } from "@component/Typography";
import Product from "@models/product.model";

type Props = {
  product: Product;
};

export default function ProductDescription({ product }: Props) {
  return (
    <div>
      <H3 mb="1rem">Specification:</H3>
      <Typography>{product.description}</Typography>
    </div>
  );
}
