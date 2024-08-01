"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Card from "@component/Card";
import Icon from "@component/icon/Icon";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Pagination from "@component/pagination";
import { IconButton } from "@component/buttons";
import Typography, { H5 } from "@component/Typography";
import { deletePaymentMethod } from "actions/payments/deletePaymentMethod";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  methodList: PaymentMethod[];
}

export default function PaymentMethodList({ methodList }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const getCardType = (cardNumber: string) => {
    // Implement logic to determine card type based on card number
    // This is a simplified example
    if (cardNumber.startsWith("34") || cardNumber.startsWith("37"))
      return "Amex";
    if (cardNumber.startsWith("4")) return "Visa";
    if (cardNumber.startsWith("5")) return "Mastercard";
    return "Credit Card";
  };

  return (
    <>
      {methodList.map((item) => (
        <TableRow key={item.id} my="1rem" padding="6px 18px">
          <FlexBox alignItems="center" m="6px">
            <Card width="42px" height="28px" mr="10px" elevation={4}>
              <img
                width="100%"
                alt={getCardType(item.cardNumber)}
                src={`/assets/images/payment-methods/${getCardType(
                  item.cardNumber
                ).toLowerCase()}.svg`}
              />
            </Card>

            <H5 className="pre" m="6px">
              {item.cardHolderName}
            </H5>
          </FlexBox>

          <Typography className="pre" m="6px">
            **** **** **** {item.cardNumber.slice(-4)}
          </Typography>

          <Typography className="pre" m="6px">
            {item.expirationDate}
          </Typography>

          <Typography className="pre" textAlign="center" color="text.muted">
            <IconButton
              onClick={() => router.push(`/payment-methods/${item.id}`)}
            >
              <Icon variant="small" defaultcolor="currentColor">
                edit
              </Icon>
            </IconButton>

            <IconButton
              onClick={() => handleDelete(item.id)}
              disabled={deleteMutation.isPending}
            >
              <Icon variant="small" defaultcolor="currentColor">
                delete
              </Icon>
            </IconButton>
          </Typography>
        </TableRow>
      ))}

      <FlexBox justifyContent="center" mt="2.5rem">
        <Pagination pageCount={5} onChange={(data) => console.log(data)} />
      </FlexBox>
    </>
  );
}
