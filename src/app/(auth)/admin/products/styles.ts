import styled from "styled-components";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";

export const TableWrapper = styled(Box)`
  background: ${(props) => props.theme.colors.body.paper};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: ${(props) => props.theme.colors.gray[100]};
`;

export const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};
  }
`;

export const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

export const TableCell = styled.td`
  padding: 1rem;
`;

export const NoProductsWrapper = styled(FlexBox)`
  height: 100vh;
//   background: ${props => props.theme.colors.body.paper};
`;

export const IconWrapper = styled(Box)`
  background: ${props => props.theme.colors.gray[200]};
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;