// components/admin/ProductList.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6 } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import Checkbox from "@component/CheckBox";
import Modal from "@component/Modal";
import TextField from "@component/text-field";
import Select from "@component/Select";

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
  onUpdateProduct: (product: Partial<Product>) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelect,
  selectedProducts,
  onUpdateProduct,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const itemsPerPage = 10;

  const handleCheckboxChange = (productId: string) => {
    const isSelected = selectedProducts.includes(productId);
    onSelect(productId, !isSelected);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleEditClose = () => {
    setEditingProduct(null);
  };

  const handleEditSave = () => {
    if (editingProduct) {
      onUpdateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleEditChange = (field: keyof Product, value: string | number) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

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
                    onClick={() => handleEditClick(product)}
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

      {editingProduct && (
        <Modal open={true} onClose={handleEditClose}>
          <Box p={4}>
            <H6 mb={3}>Edit Product</H6>
            <TextField
              fullwidth
              mb={2}
              label="Name"
              value={editingProduct.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="SKU"
              value={editingProduct.sku}
              onChange={(e) => handleEditChange("sku", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="Price"
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                handleEditChange("price", parseFloat(e.target.value))
              }
            />
            <TextField
              fullwidth
              mb={2}
              label="Stock"
              type="number"
              value={editingProduct.stock}
              onChange={(e) =>
                handleEditChange("stock", parseInt(e.target.value))
              }
            />
            <Select
              fullwidth
              mb={2}
              label="Category"
              value={editingProduct.category}
              onChange={(e) => handleEditChange("category", e.target.value)}
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              {/* Add more categories as needed */}
            </Select>
            <TextField
              fullwidth
              mb={2}
              label="Vendor"
              value={editingProduct.vendor}
              onChange={(e) => handleEditChange("vendor", e.target.value)}
            />
            <Select
              fullwidth
              mb={3}
              label="Status"
              value={editingProduct.status}
              onChange={(e) => handleEditChange("status", e.target.value)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out-of-stock">Out of Stock</option>
            </Select>
            <FlexBox justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                mr={2}
                onClick={handleEditClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditSave}
              >
                Save Changes
              </Button>
            </FlexBox>
          </Box>
        </Modal>
      )}
    </TableWrapper>
  );
};

export default ProductList;
