import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";
import Select, { SelectOption } from "@component/Select";

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

const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

interface CustomerSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const CustomerSearchFilter: React.FC<CustomerSearchFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter({ status: status?.value || "", startDate, endDate });
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatus(null);
    setStartDate("");
    setEndDate("");
    onSearch("");
    onFilter({});
  };

  return (
    <FilterBox>
      <ResponsiveFlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={2}
        />
        <Select
          placeholder="Status"
          value={status}
          onChange={(option) => setStatus(option as SelectOption)}
          mb={2}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
        />
        <StyledInput
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <StyledInput
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
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

export default CustomerSearchFilter;
