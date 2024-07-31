import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import TextField from "@component/text-field";
import { Button } from "@component/buttons";
import Select, { SelectOption } from "@component/Select"; // Ensure SelectOption is imported

import { FilterBox, ResponsiveFlexBox, StyledInput } from "./styles";

interface OrderSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}

const OrderSearchFilter: React.FC<OrderSearchFilterProps> = ({
  onSearch,
  onFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<SelectOption | null>(null);
  const [fulfillmentStatus, setFulfillmentStatus] =
    useState<SelectOption | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleFilter = () => {
    onFilter({
      paymentStatus: paymentStatus?.value || "",
      fulfillmentStatus: fulfillmentStatus?.value || "",
      startDate,
      endDate,
    });
  };

  const paymentStatusOptions: SelectOption[] = [
    { value: "", label: "All Payment Statuses" },
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Failed", label: "Failed" },
  ];

  const fulfillmentStatusOptions: SelectOption[] = [
    { value: "", label: "All Fulfillment Statuses" },
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Shipped", label: "Shipped" },
    { value: "Delivered", label: "Delivered" },
    { value: "Cancelled", label: "Cancelled" },
  ];

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
          onChange={(option) => setPaymentStatus(option as SelectOption)}
          options={paymentStatusOptions}
          mb={2}
        />
        <Select
          placeholder="Fulfillment Status"
          value={fulfillmentStatus}
          onChange={(option) => setFulfillmentStatus(option as SelectOption)}
          options={fulfillmentStatusOptions}
          mb={2}
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
      </ResponsiveFlexBox>
    </FilterBox>
  );
};

export default OrderSearchFilter;
