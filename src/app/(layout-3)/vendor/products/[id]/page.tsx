"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Fragment } from "react";
import axios from "@lib/axios";
import { Button } from "@component/buttons";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { ProductForm } from "@sections/vendor-dashboard/products";
import { IDParams } from "interfaces";
import Spinner from "@component/Spinner";
import ErrorBoundary from "@component/ErrorBoundary";

const categoryOptions = [
  { label: "Fashion", value: "fashion" },
  { label: "Gadget", value: "gadget" },
];

const brandOptions = [
  { label: "Brand 1", value: "brand1" },
  { label: "Brand 2", value: "brand2" },
];

export default function ProductDetails({ params }: IDParams) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/products/vendor/product/${params.id}`
        );
        console.log("API Response:", response);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;

  console.log("Product data in ProductDetails:", product);

  return (
    <Fragment>
      <ErrorBoundary>
        <DashboardPageHeader
          title="Edit Product"
          iconName="delivery-box"
          button={
            <Link href="/vendor/products">
              <Button color="primary" bg="primary.light" px="2rem">
                Back to Product List
              </Button>
            </Link>
          }
        />

        {product ? (
          <ProductForm
            product={product}
            categoryOptions={categoryOptions}
            brandOptions={brandOptions}
          />
        ) : (
          <div>No product found</div>
        )}
      </ErrorBoundary>
    </Fragment>
  );
}
