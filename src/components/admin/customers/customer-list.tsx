import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import Checkbox from "@component/CheckBox";
import Icon from "@component/icon/Icon";
import Modal from "@component/Modal";
import Select, { SelectOption } from "@component/Select";
import TextField from "@component/text-field";
import { format, parseISO } from "date-fns";
import { currency } from "@utils/utils";

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

const NoCustomersWrapper = styled(FlexBox)`
  height: 300px;
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const IconWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.gray[200]};
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

interface Customer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
}

interface CustomerListProps {
  customers: Customer[];
  onSelect: (customerId: string, isSelected: boolean) => void;
  selectedCustomers: string[];
  onUpdateCustomer: (customer: Partial<Customer>) => void;
  onDeleteCustomer: (customerId: string) => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onSelect,
  selectedCustomers,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  const handleCheckboxChange = (customerId: string) => {
    const isSelected = selectedCustomers.includes(customerId);
    onSelect(customerId, !isSelected);
  };

  const handleEditClick = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleEditClose = () => {
    setEditingCustomer(null);
  };

  const handleEditSave = () => {
    if (editingCustomer) {
      onUpdateCustomer(editingCustomer);
      setEditingCustomer(null);
    }
  };

  const handleEditChange = (field: keyof Customer, value: string | number) => {
    if (editingCustomer) {
      setEditingCustomer({ ...editingCustomer, [field]: value });
    }
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      onDeleteCustomer(customerToDelete.id);
      setCustomerToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setCustomerToDelete(null);
  };

  if (!customers || customers.length === 0) {
    return (
      <NoCustomersWrapper
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <IconWrapper>
          <Icon size="40px" color="primary">
            users
          </Icon>
        </IconWrapper>
        <H6 color="text.muted" mb={1}>
          No Customers Found
        </H6>
        <Paragraph color="text.hint">
          There are no customers matching your search criteria.
        </Paragraph>
      </NoCustomersWrapper>
    );
  }

  return (
    <TableWrapper>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableHeaderCell>
              <Checkbox
                checked={
                  selectedCustomers.length === customers.length &&
                  customers.length > 0
                }
                onChange={() => {
                  if (selectedCustomers.length === customers.length) {
                    onSelect("all", false);
                  } else {
                    onSelect("all", true);
                  }
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Registration Date</TableHeaderCell>
            <TableHeaderCell>Total Orders</TableHeaderCell>
            <TableHeaderCell>Total Spent</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {currentCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => handleCheckboxChange(customer.id)}
                />
              </TableCell>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {format(
                  parseISO(customer.registrationDate),
                  "MMM dd, yyyy HH:mm"
                )}
              </TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>{currency(customer.totalSpent)}</TableCell>
              <TableCell>
                <H6
                  color={
                    customer.status === "Active" ? "success.main" : "error.main"
                  }
                >
                  {customer.status}
                </H6>
              </TableCell>
              <TableCell>
                <FlexBox>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    mr={1}
                    onClick={() => handleEditClick(customer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(customer)}
                  >
                    Delete
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          pageCount={Math.ceil(customers.length / itemsPerPage)}
          onChange={(data) => setCurrentPage(data.selected + 1)}
        />
      </Box>

      {editingCustomer && (
        <Modal open={true} onClose={handleEditClose}>
          <Box p={4}>
            <H6 mb={3}>Edit Customer</H6>
            <TextField
              fullwidth
              mb={2}
              label="Name"
              value={editingCustomer.name}
              onChange={(e) => handleEditChange("name", e.target.value)}
            />
            <TextField
              fullwidth
              mb={2}
              label="Email"
              value={editingCustomer.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />
            <Select
              mb={3}
              label="Status"
              value={{
                label: editingCustomer.status,
                value: editingCustomer.status,
              }}
              onChange={(option) =>
                handleEditChange("status", (option as SelectOption).value)
              }
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
            <FlexBox justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                mr={2}
                onClick={handleEditClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditSave}
              >
                Save Changes
              </Button>
            </FlexBox>
          </Box>
        </Modal>
      )}

      {customerToDelete && (
        <Modal open={true} onClose={handleDeleteCancel}>
          <Box p={4}>
            <H6 mb={3}>Confirm Deletion</H6>
            <Paragraph mb={3}>
              Are you sure you want to delete the customer "
              {customerToDelete.name}"? This action cannot be undone.
            </Paragraph>
            <FlexBox justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                mr={2}
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            </FlexBox>
          </Box>
        </Modal>
      )}
    </TableWrapper>
  );
};

export default CustomerList;
