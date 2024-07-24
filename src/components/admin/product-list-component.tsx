// components/admin/ProductList.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6 } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import Checkbox from "@component/CheckBox";

const TableWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${(props) => props.theme.colors.gray[100]};
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  }
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
`;

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
  products: Product[];
  onSelect: (productId: string, isSelected: boolean) => void;
  selectedProducts: string[];
}

const ProductList: React.FC<ProductListProps> = ({
  products,
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

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <Checkbox
                checked={selectedProducts.length === products.length}
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
