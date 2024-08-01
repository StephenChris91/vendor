import { Order } from "@models/order.model";
import Pagination from "@component/pagination";

type OrdersPaginationProps = {
  orderList: Order[];
};

export default function OrdersPagination({ orderList }: OrdersPaginationProps) {
  return (
    <Pagination
      pageCount={Math.ceil(orderList.length / 10)}
      onChange={(data) => {
        console.log(data);
      }}
    />
  );
}
