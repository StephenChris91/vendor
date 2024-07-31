import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6 } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";

import {
  TableWrapper,
  TableHead,
  TableRow,
  TableHeaderCell,
  StyledTable,
  TableCell,
} from "./styles";

interface Vendor {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: string;
  totalSales: number;
  productCount: number;
  rating: number;
}

interface VendorListProps {
  vendors: Vendor[];
  onViewProfile: (id: string) => void;
  onEditVendor: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors = [], // Default to an empty array
  onViewProfile,
  onEditVendor,
  onToggleStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10; // Set number of items per page

  // Handle page change event for pagination
  const handlePageChange = (data: { selected: number }) => {
    setCurrentPage(data.selected + 1); // ReactPaginate is 0-indexed
    console.log("Page changed to:", data.selected + 1);
  };

  // Slice vendors to show only those on the current page
  const displayedVendors = Array.isArray(vendors)
    ? vendors.slice(
        (currentPage - 1) * vendorsPerPage,
        currentPage * vendorsPerPage
      )
    : []; // Ensure displayedVendors is an array

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Registration Date</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Total Sales</TableHeaderCell>
            <TableHeaderCell>Products</TableHeaderCell>
            <TableHeaderCell>Rating</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {displayedVendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.registrationDate}</TableCell>
              <TableCell>
                <H6
                  color={
                    vendor.status === "active"
                      ? "success.main"
                      : vendor.status === "inactive"
                      ? "error.main"
                      : "warning.main"
                  }
                >
                  {vendor.status}
                </H6>
              </TableCell>
              <TableCell>${vendor.totalSales.toLocaleString()}</TableCell>
              <TableCell>{vendor.productCount}</TableCell>
              <TableCell>{vendor.rating.toFixed(1)}</TableCell>
              <TableCell>
                <FlexBox>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => onViewProfile(vendor.id)}
                    mr={1}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => onEditVendor(vendor.id)}
                    mr={1}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color={vendor.status === "active" ? "primary" : "secondary"}
                    onClick={() => onToggleStatus(vendor.id, vendor.status)}
                  >
                    {vendor.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          pageCount={Math.ceil(vendors.length / vendorsPerPage)}
          onChange={handlePageChange}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          // Ensure `page` is correctly mapped to 0-based index
          // page={currentPage - 1}
        />
      </Box>
    </TableWrapper>
  );
};

export default VendorList;
