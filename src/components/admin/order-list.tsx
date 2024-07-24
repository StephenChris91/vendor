// components/admin/OrderList.tsx
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

const NoOrdersWrapper = styled(FlexBox)`
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

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  fulfillmentStatus: string;
}

interface OrderListProps {
  orders: Order[];
  onSelect: (orderId: string, isSelected: boolean) => void;
  selectedOrders: string[];
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onSelect,
  selectedOrders,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handleCheckboxChange = (orderId: string) => {
    const isSelected = selectedOrders.includes(orderId);
    onSelect(orderId, !isSelected);
  };

  if (!orders || orders.length === 0) {
    return (
      <NoOrdersWrapper
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <IconWrapper>
          <Icon size="40px" color="text.muted">
            shopping-bag
          </Icon>
        </IconWrapper>
        <H6 color="text.muted" mb={1}>
          No Orders Found
        </H6>
        <Paragraph color="text.hint">
          There are no orders matching your search criteria.
        </Paragraph>
      </NoOrdersWrapper>
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
                  selectedOrders.length === orders.length && orders.length > 0
                }
                onChange={() => {
                  if (selectedOrders.length === orders.length) {
                    onSelect("all", false);
                  } else {
                    onSelect("all", true);
                  }
                }}
              />
            </TableHeaderCell>
            <TableHeaderCell>Order ID</TableHeaderCell>
            <TableHeaderCell>Customer</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
            <TableHeaderCell>Payment Status</TableHeaderCell>
            <TableHeaderCell>Fulfillment Status</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {currentOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleCheckboxChange(order.id)}
                />
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.orderDate}</TableCell>
              <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <H6
                  color={
                    order.paymentStatus === "Paid"
                      ? "success.main"
                      : order.paymentStatus === "Pending"
                      ? "warning.main"
                      : "error.main"
                  }
                >
                  {order.paymentStatus}
                </H6>
              </TableCell>
              <TableCell>
                <H6
                  color={
                    order.fulfillmentStatus === "Delivered"
                      ? "success.main"
                      : order.fulfillmentStatus === "Shipped"
                      ? "info.main"
                      : order.fulfillmentStatus === "Processing"
                      ? "warning.main"
                      : order.fulfillmentStatus === "Cancelled"
                      ? "error.main"
                      : "text.muted"
                  }
                >
                  {order.fulfillmentStatus}
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
                  <Button variant="outlined" color="secondary" size="small">
                    Update
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          count={Math.ceil(orders.length / itemsPerPage)}
          onChange={(_, page) => setCurrentPage(page)}
          page={currentPage}
        />
      </Box>
    </TableWrapper>
  );
};

export default OrderList;
