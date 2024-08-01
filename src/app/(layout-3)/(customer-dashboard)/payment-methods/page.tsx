"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {
  AddNewPayment,
  PaymentMethodList,
} from "@sections/customer-dashboard/payment-method";
import { getPaymentMethods } from "actions/payments/getPaymentMethods";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PaymentMethods() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      const result = await getPaymentMethods();
      if ("error" in result) {
        throw new Error(result.error);
      }
      return result;
    },
  });

  console.log("Query result:", { data, isLoading, error });

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    console.error("React Query error:", error);
    return (
      <div>
        An error occurred:{" "}
        {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  const paymentMethods = data?.paymentMethods || [];

  return (
    <Fragment>
      <DashboardPageHeader
        button={<AddNewPayment />}
        title="Payment Methods"
        iconName="credit-card_filled"
      />

      <PaymentMethodList methodList={paymentMethods} />
    </Fragment>
  );
}
