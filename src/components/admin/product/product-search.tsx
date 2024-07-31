// components/admin/ProductSearchFilter.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";
import Select, { SelectOption } from "@component/Select";

import { ResponsiveFlexBox, FilterBox } from "./styles";

const categoryOptions: SelectOption[] = [
  { label: "All Categories", value: "" },
  { label: "Electronics", value: "electronics" },
  { label: "Clothing", value: "clothing" },
  // Add more categories as needed
];

const statusOptions: SelectOption[] = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Out of Stock", value: "out-of-stock" },
];

interface ProductSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: { category: string; status: string }) => void;
}

const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<SelectOption | null>(null);
  const [status, setStatus] = useState<SelectOption | null>(null);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter({ category: category?.value || "", status: status?.value || "" });
  };

  const handleReset = () => {
    setSearchQuery("");
    setCategory(null);
    setStatus(null);
    onSearch("");
    onFilter({ category: "", status: "" });
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
          mr={2}
        />
        <Select
          placeholder="Filter by category"
          value={category}
          onChange={(option) => setCategory(option as SelectOption)}
          options={categoryOptions}
          mb={2}
          mr={2}
        />
        <Select
          placeholder="Filter by status"
          value={status}
          onChange={(option) => setStatus(option as SelectOption)}
          options={statusOptions}
          mb={2}
          mr={2}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilter}
          mb={2}
          mr={2}
        >
          Apply Filters
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleSearch}
          mb={2}
          mr={2}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          mb={2}
        >
          Reset
        </Button>
      </ResponsiveFlexBox>
    </FilterBox>
  );
};

export default ProductSearchFilter;
