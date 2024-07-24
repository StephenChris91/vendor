// components/admin/VendorSearchFilter.tsx
import React from "react";
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

interface VendorSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const VendorSearchFilter: React.FC<VendorSearchFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [status, setStatus] = React.useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter({ status });
  };

  return (
    <FilterBox>
      <FlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mr={2}
          mb={2}
        />
        <Select
          placeholder="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          mr={2}
          mb={2}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
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
      </FlexBox>
    </FilterBox>
  );
};

export default VendorSearchFilter;
