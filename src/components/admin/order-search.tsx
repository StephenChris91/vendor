// components/admin/OrderSearchFilter.tsx
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

const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

interface OrderSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const OrderSearchFilter: React.FC<OrderSearchFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fulfillmentStatus, setFulfillmentStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter({ paymentStatus, fulfillmentStatus, startDate, endDate });
  };

  return (
    <FilterBox>
      <ResponsiveFlexBox
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          mb={2}
        />
        <Select
          placeholder="Payment Status"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          mb={2}
        >
          <option value="">All Payment Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </Select>
        <Select
          placeholder="Fulfillment Status"
          value={fulfillmentStatus}
          onChange={(e) => setFulfillmentStatus(e.target.value)}
          mb={2}
        >
          <option value="">All Fulfillment Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </Select>
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
      </ResponsiveFlexBox>
    </FilterBox>
  );
};

export default OrderSearchFilter;
