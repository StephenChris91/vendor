import React from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6 } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  TableWrapper,
  TableHead,
  TableRow,
  TableHeaderCell,
  StyledTable,
  TableCell,
} from "./styles";
import { updateVendorStatus } from "actions/updateVendorStatus";

interface Vendor {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "active" | "inactive";
  totalSales: number;
  productCount: number;
  rating: number;
}

interface VendorListProps {
  vendors: Vendor[];
  onToggleStatus: (id: string, newStatus: "active" | "inactive") => void;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors = [],
  onToggleStatus,
}) => {
  const router = useRouter();

  const handleStatusChange = async (
    vendorId: string,
    currentStatus: "active" | "inactive"
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const toastId = toast.loading(
      `${newStatus === "active" ? "Activating" : "Deactivating"} vendor...`
    );
    try {
      await updateVendorStatus(vendorId, newStatus);
      onToggleStatus(vendorId, newStatus);
      toast.success(
        `Vendor ${
          newStatus === "active" ? "activated" : "deactivated"
        } successfully`,
        { id: toastId }
      );
    } catch (error) {
      console.error("Failed to update vendor status:", error);
      toast.error(
        `Failed to ${
          newStatus === "active" ? "activate" : "deactivate"
        } vendor. Please try again.`,
        { id: toastId }
      );
    }
  };

  const handleViewVendor = (vendorId: string) => {
    router.push(`/admin/vendors/${vendorId}`);
  };

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
                    vendor.status === "active" ? "success.main" : "error.main"
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
                    onClick={() => handleViewVendor(vendor.id)}
                    mr={1}
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    // color={vendor.status === "active" ? "error.main" : "success.main"}
                    color={vendor.status === "active" ? "primary" : "warn"}
                    onClick={() => handleStatusChange(vendor.id, vendor.status)}
                  >
                    {vendor.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default VendorList;
