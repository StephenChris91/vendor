"use client";

import Box from "@component/Box";
import Card from "@component/Card";
import Modal from "@component/Modal";
import Icon from "@component/icon/Icon";
import ProductIntro from "@component/products/ProductIntro";
import Product from "@models/product.model";

// type Product = {
//   id: string;
//   images: string[];
//   slug: string;
//   price: number;
//   name: string;
// };

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
};

type ProductCardProps = {
  id: string;
  slug: string;
  unit: string;
  title: string;
  price: number;
  off: number;
  rating: number;
  images: string[];
  imgUrl: string;
};

export default function ProductCard10({
  id,
  slug,
  unit,
  title,
  price,
  off,
  rating,
  images,
  imgUrl,
}: ProductCardProps) {
  return (
    <Card>
      {/* Render the product card with these props */}
      <div>
        {/* Product Image */}
        <img
          src={imgUrl}
          alt={title}
          style={{ width: "100%", height: "auto" }}
        />

        {/* Product Title */}
        <h3>{title}</h3>

        {/* Unit Information */}
        <p>{unit}</p>

        {/* Product Price */}
        <p>Price: ${price.toFixed(2)}</p>

        {/* Discount Information */}
        {off > 0 && <p>Discount: {off}% off</p>}

        {/* Product Rating */}
        <p>Rating: {rating}/5</p>

        {/* Additional rendering logic can go here */}
      </div>
    </Card>
  );
}
