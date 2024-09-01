"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";
import ProductGridView from "@component/products/ProductCard1List";
import ProductListView from "@component/products/ProductCard9List";
import ProductFilterCard from "@component/products/ProductFilterCard";
import useWindowSize from "@hook/useWindowSize";
import Product, { Category } from "@models/product.model";
import { getAllProducts } from "actions/products";
import { navigations } from "@data/navigations";

type Props = {
  sortOptions: { label: string; value: string }[];
};

type ProductWithDetails = Awaited<ReturnType<typeof getAllProducts>>[number];

export default function SearchResult({ sortOptions }: Props) {
  const width = useWindowSize();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithDetails[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchParams = useSearchParams();

  const isTablet = width < 1025;

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    setSelectedCategory(category);
    setSearchQuery(query || "");
    filterProducts(category, query || "");
  }, [searchParams, products]);

  const filterProducts = (category: string | null, query: string) => {
    let filtered = [...products];

    if (category) {
      const categoryHierarchy = findCategoryHierarchy(category);
      filtered = filtered.filter((product) =>
        product.categories.some((cat) => categoryHierarchy.includes(cat.name))
      );
    }

    if (query) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const findCategoryHierarchy = (categoryName: string): string[] => {
    const hierarchy: string[] = [];
    const findCategory = (items: any[]): boolean => {
      for (const item of items) {
        if (item.title.toLowerCase() === categoryName.toLowerCase()) {
          hierarchy.push(item.title);
          return true;
        }
        if (item.menuData && item.menuData.categories) {
          hierarchy.push(item.title);
          if (findCategory(item.menuData.categories)) {
            return true;
          }
          hierarchy.pop();
        }
      }
      return false;
    };
    findCategory(navigations);
    return hierarchy;
  };

  const toggleView = useCallback((v: "grid" | "list") => () => setView(v), []);

  const transformProducts = (prods: ProductWithDetails[]): Product[] =>
    prods.map((p) => ({
      ...p,
      stock: p.quantity,
      shop: { id: "", shopName: p.shop_name || "" },
      user: null,
      brandId: p.brand?.id || null,
      categories: p.categories.map((cat) => ({
        productId: p.id,
        categoryId: cat.id,
        ...cat,
      })) as Category[],
    }));

  const transformedFilteredProducts = transformProducts(filteredProducts);
  const transformedAllProducts = transformProducts(products);

  return (
    <>
      <FlexBox
        as={Card}
        mb="55px"
        p="1.25rem"
        elevation={5}
        flexWrap="wrap"
        borderRadius={8}
        alignItems="center"
        justifyContent="space-between"
      >
        <div>
          <H5>
            {selectedCategory
              ? `Searching for "${selectedCategory}"`
              : searchQuery
              ? `Searching for "${searchQuery}"`
              : "All Products"}
          </H5>
          <Paragraph color="text.muted">
            {filteredProducts.length} results found
          </Paragraph>
        </div>

        <FlexBox alignItems="center" flexWrap="wrap">
          <Paragraph color="text.muted" mr="1rem">
            Sort by:
          </Paragraph>

          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              placeholder="Sort by"
              defaultValue={sortOptions[0]}
              options={sortOptions}
            />
          </Box>

          <Paragraph color="text.muted" mr="0.5rem">
            View:
          </Paragraph>

          <IconButton onClick={toggleView("grid")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "grid" ? "primary" : "inherit"}
            >
              grid
            </Icon>
          </IconButton>

          <IconButton onClick={toggleView("list")}>
            <Icon
              variant="small"
              defaultcolor="auto"
              color={view === "list" ? "primary" : "inherit"}
            >
              menu
            </Icon>
          </IconButton>

          {isTablet && (
            <Sidenav
              position="left"
              scroll={true}
              handle={
                <IconButton>
                  <Icon>options</Icon>
                </IconButton>
              }
            >
              <ProductFilterCard />
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>

      <Grid container spacing={6}>
        <Grid item lg={3} xs={12}>
          <ProductFilterCard />
        </Grid>

        <Grid item lg={9} xs={12}>
          {filteredProducts.length === 0 &&
          (selectedCategory || searchQuery) ? (
            <Box mb="2rem">
              <Paragraph fontSize="18px" fontWeight="600" mb="1rem">
                No products matching your selection
              </Paragraph>
              <Paragraph fontSize="14px" mb="2rem">
                We couldn't find any products that match your current selection.
                Here are some recommendations you might like:
              </Paragraph>
            </Box>
          ) : null}

          {view === "grid" ? (
            <ProductGridView
              products={
                filteredProducts.length > 0 ||
                (!selectedCategory && !searchQuery)
                  ? transformedFilteredProducts
                  : transformedAllProducts
              }
            />
          ) : (
            <ProductListView
              products={
                filteredProducts.length > 0 ||
                (!selectedCategory && !searchQuery)
                  ? transformedFilteredProducts
                  : transformedAllProducts
              }
            />
          )}
        </Grid>
      </Grid>
    </>
  );
}
