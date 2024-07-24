// components/admin/VendorList.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { Button } from "@component/buttons";
import { H6 } from "@component/Typography";
import Pagination from "@component/pagination";

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

const TableHeaderCell = styled.th<{ isSorted: boolean; isSortedDesc: boolean }>`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  cursor: pointer;

  &:after {
    content: "${(props) =>
      props.isSorted ? (props.isSortedDesc ? " 🔽" : " 🔼") : ""}";
    font-size: 0.8em;
    margin-left: 5px;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
`;

interface Vendor {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "active" | "inactive" | "pending";
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
  vendors,
  onViewProfile,
  onEditVendor,
  onToggleStatus,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Vendor;
    direction: "ascending" | "descending";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedVendors = React.useMemo(() => {
    let sortableVendors = [...vendors];
    if (sortConfig !== null) {
      sortableVendors.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableVendors;
  }, [vendors, sortConfig]);

  const requestSort = (key: keyof Vendor) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedVendors.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell
              onClick={() => requestSort("name")}
              isSorted={sortConfig?.key === "name"}
              isSortedDesc={
                sortConfig?.key === "name" &&
                sortConfig.direction === "descending"
              }
            >
              Name
            </TableHeaderCell>
            <TableHeaderCell
              onClick={() => requestSort("email")}
              isSorted={sortConfig?.key === "email"}
              isSortedDesc={
                sortConfig?.key === "email" &&
                sortConfig.direction === "descending"
              }
            >
              Email
            </TableHeaderCell>
            <TableHeaderCell
              onClick={() => requestSort("registrationDate")}
              isSorted={sortConfig?.key === "registrationDate"}
              isSortedDesc={
                sortConfig?.key === "registrationDate" &&
                sortConfig.direction === "descending"
              }
            >
              Registration Date
            </TableHeaderCell>
            <TableHeaderCell
              onClick={() => requestSort("status")}
              isSorted={sortConfig?.key === "status"}
              isSortedDesc={
                sortConfig?.key === "status" &&
                sortConfig.direction === "descending"
              }
            >
              Status
            </TableHeaderCell>
            <TableHeaderCell
              onClick={() => requestSort("totalSales")}
              isSorted={sortConfig?.key === "totalSales"}
              isSortedDesc={
                sortConfig?.key === "totalSales" &&
                sortConfig.direction === "descending"
              }
            >
              Total Sales
            </TableHeaderCell>
            <TableHeaderCell
              onClick={() => requestSort("productCount")}
              isSorted={sortConfig?.key === "productCount"}
              isSortedDesc={
                sortConfig?.key === "productCount" &&
                sortConfig.direction === "descending"
              }
            >
              Products
            </TableHeaderCell>
            <TableHeaderCell
              onClick={() => requestSort("rating")}
              isSorted={sortConfig?.key === "rating"}
              isSortedDesc={
                sortConfig?.key === "rating" &&
                sortConfig.direction === "descending"
              }
            >
              Rating
            </TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {currentItems.map((vendor) => (
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
                    color={vendor.status === "active" ? "error" : "success"}
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
          count={Math.ceil(vendors.length / itemsPerPage)}
          onChange={(_, page) => paginate(page)}
          page={currentPage}
        />
      </Box>
    </TableWrapper>
  );
};

export default VendorList;
