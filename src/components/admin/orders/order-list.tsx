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
import Modal from "@component/Modal";
import Select, { SelectOption } from "@component/Select";
import { format, parseISO } from "date-fns";
import { currency } from "@utils/utils";
import {
  NoOrdersWrapper,
  IconWrapper,
  TableWrapper,
  StyledTable,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "./styles";

interface Order {
  id: string;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

interface OrderListProps {
  orders: Order[];
  onSelect: (orderId: string, isSelected: boolean) => void;
  selectedOrders: string[];
  onUpdateOrder: (order: Partial<Order>) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onSelect,
  selectedOrders,
  onUpdateOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  const handleCheckboxChange = (orderId: string) => {
    const isSelected = selectedOrders.includes(orderId);
    onSelect(orderId, !isSelected);
  };

  const handleEditClick = (order: Order) => {
    setEditingOrder(order);
  };

  const handleEditClose = () => {
    setEditingOrder(null);
  };

  const handleEditSave = () => {
    if (editingOrder) {
      onUpdateOrder(editingOrder);
      setEditingOrder(null);
    }
  };

  const handleEditChange = (field: keyof Order, value: string | number) => {
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, [field]: value });
    }
  };

  const getSelectOption = (value: string, options: SelectOption[]) => {
    return options.find((option) => option.value === value) || null;
  };

  const statusOptions: SelectOption[] = [
    { label: "Pending", value: "Pending" },
    { label: "Processing", value: "Processing" },
    { label: "Complete", value: "Complete" },
  ];

  if (!orders || orders.length === 0) {
    return (
      <NoOrdersWrapper
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <IconWrapper>
          <Icon size="40px" color="primary">
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
            <TableHeaderCell>Status</TableHeaderCell>
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
              <TableCell>
                {format(parseISO(order.orderDate), "MMM dd, yyyy HH:mm")}
              </TableCell>
              <TableCell>{currency(order.totalAmount)}</TableCell>
              <TableCell>
                <H6
                  color={
                    order.status === "Complete"
                      ? "success.main"
                      : order.status === "Processing"
                      ? "warning.main"
                      : "text.muted"
                  }
                >
                  {order.status}
                </H6>
              </TableCell>
              <TableCell>
                <FlexBox>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    mr={1}
                    onClick={() => handleEditClick(order)}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary" size="small">
                    View
                  </Button>
                </FlexBox>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <Box p={2}>
        <Pagination
          pageCount={Math.ceil(orders.length / itemsPerPage)}
          onChange={({ selected }) => setCurrentPage(selected + 1)}
        />
      </Box>

      {editingOrder && (
        <Modal open={true} onClose={handleEditClose}>
          <Box p={4}>
            <H6 mb={3}>Edit Order</H6>
            <Select
              mb={3}
              label="Status"
              value={getSelectOption(editingOrder.status, statusOptions)}
              onChange={(option) =>
                handleEditChange("status", (option as SelectOption).value)
              }
              options={statusOptions}
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
    </TableWrapper>
  );
};

export default OrderList;
