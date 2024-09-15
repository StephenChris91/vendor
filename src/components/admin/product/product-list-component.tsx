// product-list-component.tsx
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
import Select, { SelectOption } from "@component/Select";
import toast from "react-hot-toast";

import {
  TableWrapper,
  StyledTable,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "./styles";

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  categories: { name: string }[];
  shop: { shopName: string };
  status: "Published" | "Draft" | "Suspended" | "OutOfStock";
}

interface ProductListProps {
  products: Product[];
  onSelect: (productId: string, isSelected: boolean) => void;
  selectedProducts: string[];
  onUpdateProduct: (updatedProduct: Partial<Product>) => Promise<void>;
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

  console.log("Products in ProductList:", products);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  const handleCheckboxChange = (productId: string) => {
    const isSelected = selectedProducts.includes(productId);
    onSelect(productId, !isSelected);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
  };

  const handleEditClose = () => {
    setEditingProduct(null);
  };

  const handleEditSave = async () => {
    if (editingProduct) {
      try {
        await onUpdateProduct(editingProduct);
        toast.success("Product updated successfully");
        setEditingProduct(null);
      } catch (error) {
        toast.error("Failed to update product");
      }
    }
  };

  const handleEditChange = (field: keyof Product, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    }
  };

  const handlePublishUnpublish = async (product: Product) => {
    const newStatus = product.status === "Published" ? "Draft" : "Published";
    try {
      await onUpdateProduct({ id: product.id, status: newStatus });
      toast.success(
        `Product ${
          newStatus === "Published" ? "published" : "unpublished"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(
        `Failed to ${
          newStatus === "Published" ? "publish" : "unpublish"
        } product. Please try again.`
      );
    }
  };

  const categoryOptions: SelectOption[] = [
    { value: "Electronics", label: "Electronics" },
    { value: "Clothing", label: "Clothing" },
    { value: "Food", label: "Food" },
    { value: "Books", label: "Books" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "Published", label: "Published" },
    { value: "Draft", label: "Draft" },
    { value: "Suspended", label: "Suspended" },
    { value: "OutOfStock", label: "Out of Stock" },
  ];

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
            <TableHeaderCell>Stock</TableHeaderCell>
            <TableHeaderCell>Price</TableHeaderCell>
            <TableHeaderCell>Category</TableHeaderCell>
            <TableHeaderCell>Vendor</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.categories[0]?.name || "N/A"}</TableCell>
                <TableCell>{product.shop?.shopName || "N/A"}</TableCell>
                <TableCell>
                  <H6
                    color={
                      product.status === "Published"
                        ? "success.main"
                        : product.status === "Draft"
                        ? "warning.main"
                        : "error.main"
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
                    <Button
                      variant="outlined"
                      color={
                        product.status === "Published" ? "primary" : "dark"
                      }
                      size="small"
                      onClick={() => handlePublishUnpublish(product)}
                    >
                      {product.status === "Published" ? "Unpublish" : "Publish"}
                    </Button>
                  </FlexBox>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9}>No products found</TableCell>
            </TableRow>
          )}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          pageCount={Math.ceil(products.length / itemsPerPage)}
          onChange={({ selected }) => setCurrentPage(selected + 1)}
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
              mb={2}
              label="Category"
              options={categoryOptions}
              value={categoryOptions.find(
                (option) => option.value === editingProduct.categories[0]?.name
              )}
              onChange={(option) =>
                handleEditChange("categories", [
                  { name: (option as SelectOption).value },
                ])
              }
            />
            <TextField
              fullwidth
              mb={2}
              label="Vendor"
              value={editingProduct.shop?.shopName}
              onChange={(e) =>
                handleEditChange("shop", { shopName: e.target.value })
              }
            />
            <Select
              mb={3}
              label="Status"
              options={statusOptions}
              value={statusOptions.find(
                (option) => option.value === editingProduct.status
              )}
              onChange={(option) =>
                handleEditChange("status", (option as SelectOption).value)
              }
            />
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
