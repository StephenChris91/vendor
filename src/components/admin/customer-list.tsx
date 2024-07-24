// components/admin/CustomerList.tsx
import React, { useState } from "react";
import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H6, Paragraph } from "@component/Typography";
import { Button } from "@component/buttons";
import Pagination from "@component/pagination";
import Checkbox from "@component/CheckBox";
import Icon from "@component/icon/Icon";

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
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onSelect,
  selectedCustomers,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

  const handleCheckboxChange = (customerId: string) => {
    const isSelected = selectedCustomers.includes(customerId);
    onSelect(customerId, !isSelected);
  };

  if (!customers || customers.length === 0) {
    return (
      <NoCustomersWrapper
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <IconWrapper>
          <Icon size="40px" color="text.muted">
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
              <TableCell>{customer.registrationDate}</TableCell>
              <TableCell>{customer.totalOrders}</TableCell>
              <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
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
                  >
                    View
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    mr={1}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color={customer.status === "Active" ? "error" : "success"}
                    size="small"
                  >
                    {customer.status === "Active" ? "Deactivate" : "Activate"}
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          count={Math.ceil(customers.length / itemsPerPage)}
          onChange={(_, page) => setCurrentPage(page)}
          page={currentPage}
        />
      </Box>
    </TableWrapper>
  );
};

export default CustomerList;
