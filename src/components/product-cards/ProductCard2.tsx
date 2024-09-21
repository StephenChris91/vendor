import Link from "next/link";
import HoverBox from "@component/HoverBox";
import { H4 } from "@component/Typography";
import NextImage from "@component/NextImage";
import { currency } from "@utils/utils";

export default function ProductCard2({ id, imgUrl, title, price }) {
  return (
    <Link href={`/product/${id}`}>
      <HoverBox
        borderRadius={8}
        mb="0.5rem"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width={181}
        height={181}
      >
        <NextImage src={imgUrl} width={181} height={181} alt={title} />
      </HoverBox>

      <H4 fontWeight="600" fontSize="14px" mb="0.25rem">
        {title}
      </H4>

      <H4 fontWeight="600" fontSize="14px" color="primary.main">
        {currency(price)}
      </H4>
    </Link>
  );
}
