"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6 } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Eye, ShieldMinus, ShieldPlus, Trash2 } from "lucide-react";
import Modal from "@component/Modal";
import {
  TableWrapper,
  TableHead,
  TableRow,
  TableHeaderCell,
  StyledTable,
  TableCell,
} from "./styles";
import { updateVendorStatus } from "actions/updateVendorStatus";
import { deleteVendorAndRelatedData } from "actions/deleteVendor";
import { sendVendorApprovalEmail } from "@lib/emails/vendorAprrovalNotifications";

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
  onDeleteVendor: (id: string) => void;
}

const VendorList: React.FC<VendorListProps> = ({
  vendors = [],
  onToggleStatus,
  onDeleteVendor,
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);

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

      if (newStatus === "active") {
        const vendor = vendors.find((v) => v.id === vendorId);
        if (vendor) {
          const response = await fetch("/api/admin/vendors/send-approval", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vendorEmail: vendor.email,
              vendorName: vendor.name,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to send approval email");
          }
        }
      }

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
        } vendor. Please try again. ${error.message}`,
        { id: toastId }
      );
    }
  };

  const handleViewVendor = (vendorId: string) => {
    router.push(`/admin/vendors/${vendorId}`);
  };

  const handleDeleteVendor = (vendorId: string) => {
    setVendorToDelete(vendorId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteVendor = async () => {
    if (vendorToDelete) {
      const toastId = toast.loading("Deleting vendor...");
      try {
        await deleteVendorAndRelatedData(vendorToDelete);
        onDeleteVendor(vendorToDelete);
        toast.success("Vendor deleted successfully", { id: toastId });
      } catch (error) {
        console.error("Failed to delete vendor:", error);
        toast.error("Failed to delete vendor. Please try again.", {
          id: toastId,
        });
      }
      setIsDeleteModalOpen(false);
      setVendorToDelete(null);
    }
  };

  return (
    <>
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
                      <Eye />
                    </Button>
                    <Button
                      variant="outlined"
                      color={vendor.status === "active" ? "primary" : "warn"}
                      onClick={() =>
                        handleStatusChange(vendor.id, vendor.status)
                      }
                      mr={1}
                    >
                      {vendor.status === "active" ? (
                        <ShieldMinus />
                      ) : (
                        <ShieldPlus />
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteVendor(vendor.id)}
                    >
                      <Trash2 />
                    </Button>
                  </FlexBox>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div
          style={{ background: "white", padding: "20px", borderRadius: "8px" }}
        >
          <h2>Confirm Deletion</h2>
          <p>
            Are you sure you want to delete this vendor? This action cannot be
            undone.
          </p>
          <FlexBox justifyContent="flex-end" mt="1rem">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsDeleteModalOpen(false)}
              mr={1}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDeleteVendor}
            >
              Delete
            </Button>
          </FlexBox>
        </div>
      </Modal>
    </>
  );
};

export default VendorList;
