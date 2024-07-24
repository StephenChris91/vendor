"use client";

// components/admin/ProductList.tsx
import {
  TableWrapper,
  StyledTable,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
  IconWrapper,
  NoProductsWrapper,
} from "./styles";

import Icon from "@component/icon/Icon";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import Checkbox from "@component/CheckBox";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  vendor: string;
  status: string;
}

interface ProductListProps {
  products: Product[] | undefined;
  onSelect: (productId: string, isSelected: boolean) => void;
  selectedProducts: string[];
}

const ProductList: React.FC<ProductListProps> = ({
  products = [],
  onSelect,
  selectedProducts,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleCheckboxChange = (productId: string) => {
    const isSelected = selectedProducts.includes(productId);
    onSelect(productId, !isSelected);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (!products || products.length === 0) {
    return (
      <NoProductsWrapper
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <IconWrapper>
          <Icon size="40px" color="text.muted">
            package
          </Icon>
        </IconWrapper>
        <H6 color="text.muted" mb={1}>
          No Products Found
        </H6>
        <Paragraph color="text.hint">
          Try adjusting your search or filter to find what you're looking for.
        </Paragraph>
      </NoProductsWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <Checkbox
                checked={
                  selectedProducts.length === products.length &&
                  products.length > 0
                }
                onChange={() => {
                  if (selectedProducts.length === products.length) {
                    onSelect("all", false);
                  } else {
                    onSelect("all", true);
                  }
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>SKU</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Vendor</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {currentProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleCheckboxChange(product.id)}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.vendor}</TableCell>
              <TableCell>
                <H6
                  color={
                    product.status === "active"
                      ? "success.main"
                      : product.status === "inactive"
                      ? "error.main"
                      : "warning.main"
                  }
                >
                  {product.status}
                </H6>
              </TableCell>
              <TableCell>
                <FlexBox>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    mr={1}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" size="small">
                    View
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          count={Math.ceil(products.length / itemsPerPage)}
          onChange={(_, page) => paginate(page)}
          page={currentPage}
        />
      </Box>
    </TableWrapper>
  );
};

export default ProductList;
