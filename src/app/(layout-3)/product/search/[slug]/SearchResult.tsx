"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Box from "@component/Box";
import Card from "@component/Card";
import Select from "@component/Select";
import Icon from "@component/icon/Icon";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import { Button, IconButton } from "@component/buttons";
import Sidenav from "@component/sidenav/Sidenav";
import { H5, Paragraph } from "@component/Typography";
import ProductGridView from "@component/products/ProductCard1List";
import ProductListView from "@component/products/ProductCard9List";
import useWindowSize from "@hook/useWindowSize";
import Product, { Category } from "@models/product.model";
import { getAllProducts } from "actions/products";
import { navigations } from "@data/navigations";
import CheckBox from "@component/CheckBox";
import TextField from "@component/text-field";

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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [sortOption, setSortOption] = useState(sortOptions[0].value);
  const searchParams = useSearchParams();

  const isTablet = width < 1025;

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data);
      if (data.length > 0) {
        const prices = data.map((p) => p.price);
        setPriceRange([Math.min(...prices), Math.max(...prices)]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const query = searchParams.get("query");
    setSelectedCategory(category);
    setSearchQuery(query || "");
    filterProducts(category, query || "");
  }, [
    searchParams,
    products,
    priceRange,
    selectedBrands,
    selectedRatings,
    sortOption,
  ]);

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

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand?.name || "")
      );
    }

    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) =>
        selectedRatings.includes(Math.floor(product.ratings || 0))
      );
    }

    switch (sortOption) {
      case "Price Low to High":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      // Remove the Date sorting option for now
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

  const handlePriceRangeChange = (newRange: [number, number]) => {
    setPriceRange([
      Math.min(newRange[0], newRange[1]),
      Math.max(newRange[0], newRange[1]),
    ]);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const handleSortChange = (option: { label: string; value: string }) => {
    setSortOption(option.value);
  };

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
              ? `${selectedCategory} - ${filteredProducts.length} items found`
              : `${filteredProducts.length} items found for "${searchQuery}"`}
          </H5>
        </div>

        <FlexBox alignItems="center" flexWrap="wrap">
          <Box flex="1 1 0" mr="1.75rem" minWidth="150px">
            <Select
              placeholder="Sort by"
              options={sortOptions}
              value={sortOptions.find((option) => option.value === sortOption)}
              onChange={handleSortChange}
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
              {/* Filter content */}
              <Card>
                <Box mb={4}>
                  <H5 mb={2}>Price Range</H5>
                  <FlexBox alignItems="center">
                    <TextField
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        handlePriceRangeChange([
                          Number(e.target.value),
                          priceRange[1],
                        ])
                      }
                    />
                    <Box mx={1}>-</Box>
                    <TextField
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        handlePriceRangeChange([
                          priceRange[0],
                          Number(e.target.value),
                        ])
                      }
                    />
                  </FlexBox>
                </Box>

                <Box mb={4}>
                  <H5 mb={2}>Brands</H5>
                  {Array.from(new Set(products.map((p) => p.brand?.name))).map(
                    (brand) => (
                      <CheckBox
                        key={brand}
                        label={brand || ""}
                        checked={selectedBrands.includes(brand || "")}
                        onChange={() => handleBrandChange(brand || "")}
                      />
                    )
                  )}
                </Box>

                <Box mb={4}>
                  <H5 mb={2}>Ratings</H5>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <CheckBox
                      key={rating}
                      label={`${rating} Star`}
                      checked={selectedRatings.includes(rating)}
                      onChange={() => handleRatingChange(rating)}
                    />
                  ))}
                </Box>
              </Card>
            </Sidenav>
          )}
        </FlexBox>
      </FlexBox>

      <Grid container spacing={6}>
        <Grid item lg={3} xs={12}>
          {/* Filter content */}
          <Card>
            <Box mb={4}>
              <H5 mb={2}>Price Range</H5>
              <FlexBox alignItems="center">
                <TextField
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    handlePriceRangeChange([
                      Number(e.target.value),
                      priceRange[1],
                    ])
                  }
                />
                <Box mx={1}>-</Box>
                <TextField
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceRangeChange([
                      priceRange[0],
                      Number(e.target.value),
                    ])
                  }
                />
              </FlexBox>
            </Box>

            <Box mb={4}>
              <H5 mb={2}>Brands</H5>
              {Array.from(new Set(products.map((p) => p.brand?.name))).map(
                (brand) => (
                  <CheckBox
                    key={brand}
                    label={brand || ""}
                    checked={selectedBrands.includes(brand || "")}
                    onChange={() => handleBrandChange(brand || "")}
                  />
                )
              )}
            </Box>

            <Box mb={4}>
              <H5 mb={2}>Ratings</H5>
              {[5, 4, 3, 2, 1].map((rating) => (
                <CheckBox
                  key={rating}
                  label={`${rating} Star`}
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
              ))}
            </Box>
          </Card>
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
