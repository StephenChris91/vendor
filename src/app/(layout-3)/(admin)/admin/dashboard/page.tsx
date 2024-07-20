// app/admin/dashboard/page.tsx
import Box from "@component/Box";
import Card from "@component/Card";
import FlexBox from "@component/FlexBox";
import { H3, H4, Paragraph } from "@component/Typography";
import Icon from "@component/icon/Icon";

// This would typically come from your database or API
const mockData = {
  totalSales: 15000,
  totalOrders: 150,
  activeUsers: 1200,
  activeVendors: 25,
  recentOrders: [
    { id: "1", user: "John Doe", amount: 150, status: "Completed" },
    { id: "2", user: "Jane Smith", amount: 200, status: "Processing" },
    { id: "3", user: "Bob Johnson", amount: 100, status: "Pending" },
  ],
};

export default function AdminDashboard() {
  return (
    <Box>
      <H3 mb="1.5rem">Dashboard</H3>

      <FlexBox flexWrap="wrap" mb="1.5rem">
        <Card flex="1" minWidth="200px" m="0.5rem">
          <FlexBox alignItems="center">
            <Icon size="40px" color="primary" mr="0.5rem">
              dollar-sign
            </Icon>
            <Box>
              <H4>${mockData.totalSales.toLocaleString()}</H4>
              <Paragraph color="text.muted">Total Sales</Paragraph>
            </Box>
          </FlexBox>
        </Card>
        <Card flex="1" minWidth="200px" m="0.5rem">
          <FlexBox alignItems="center">
            <Icon size="40px" color="primary" mr="0.5rem">
              shopping-bag
            </Icon>
            <Box>
              <H4>{mockData.totalOrders}</H4>
              <Paragraph color="text.muted">Total Orders</Paragraph>
            </Box>
          </FlexBox>
        </Card>
        <Card flex="1" minWidth="200px" m="0.5rem">
          <FlexBox alignItems="center">
            <Icon size="40px" color="primary" mr="0.5rem">
              users
            </Icon>
            <Box>
              <H4>{mockData.activeUsers}</H4>
              <Paragraph color="text.muted">Active Users</Paragraph>
            </Box>
          </FlexBox>
        </Card>
        <Card flex="1" minWidth="200px" m="0.5rem">
          <FlexBox alignItems="center">
            <Icon size="40px" color="primary" mr="0.5rem">
              store
            </Icon>
            <Box>
              <H4>{mockData.activeVendors}</H4>
              <Paragraph color="text.muted">Active Vendors</Paragraph>
            </Box>
          </FlexBox>
        </Card>
      </FlexBox>

      <Card>
        <H4 mb="1rem">Recent Orders</H4>
        {mockData.recentOrders.map((order) => (
          <FlexBox key={order.id} justifyContent="space-between" mb="0.5rem">
            <Paragraph>{order.user}</Paragraph>
            <Paragraph>${order.amount}</Paragraph>
            <Paragraph>{order.status}</Paragraph>
          </FlexBox>
        ))}
      </Card>
    </Box>
  );
}
