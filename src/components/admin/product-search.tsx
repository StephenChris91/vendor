// components/admin/ProductSearchFilter.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";
import Select from "@component/Select";

const FilterBox = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ResponsiveFlexBox = styled(FlexBox)`
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

interface ProductSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter({ category, status });
  };

  return (
    <FilterBox>
      <ResponsiveFlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={2}
        />
        <Select
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          mb={2}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          {/* Add more categories as needed */}
        </Select>
        <Select
          placeholder="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          mb={2}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out-of-stock">Out of Stock</option>
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilter}
          mb={2}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSearch}
          mb={2}
        >
          Search
        </Button>
      </ResponsiveFlexBox>
    </FilterBox>
  );
};

export default ProductSearchFilter;
