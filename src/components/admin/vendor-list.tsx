// components/admin/vendor-list.tsx
import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6 } from "@component/Typography";
import { Button } from "@component/buttons";
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

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
`;

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
  vendors,
  onViewProfile,
  onEditVendor,
  onToggleStatus,
}) => {
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
          {vendors.map((vendor) => (
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
          count={Math.ceil(vendors.length / 10)}
          onChange={(_, page) => console.log("Page changed to:", page)}
          page={1}
        />
      </Box>
    </TableWrapper>
  );
};

export default VendorList;
