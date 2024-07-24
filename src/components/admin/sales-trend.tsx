// components/admin/SalesTrendChart.tsx
import React from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { H4 } from "@component/Typography";
import Box from "@component/Box";

const ChartWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

interface SalesTrendChartProps {
  data: Array<{ name: string; sales: number }>;
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
  return (
    <ChartWrapper>
      <H4 mb="1.5rem">Sales Trend</H4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};

export default SalesTrendChart;
