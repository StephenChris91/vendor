"use client";

import { Fragment } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentSession } from "@lib/use-session-server";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {
  AddressItem,
  AddNewAddress,
  AddressPagination,
} from "@sections/customer-dashboard/address";
import { CustomerAddress } from "@prisma/client";
import { getAddresses } from "actions/addresses/getAddress";
import { useCurrentUser } from "@lib/use-session-client";
import { deleteAddress } from "actions/addresses/deleteAddress";

export default function AddressList() {
  const user = useCurrentUser();
  const queryClient = useQueryClient();

  const {
    data: addressList,
    isLoading,
    error,
  } = useQuery<CustomerAddress[], Error>({
    queryKey: ["addresses", user?.id],
    queryFn: () => (user?.id ? getAddresses(user.id) : Promise.resolve([])),
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] });
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading addresses: {error.message}</div>;

  return (
    <Fragment>
      <DashboardPageHeader
        title="My Addresses"
        iconName="pin_filled"
        button={<AddNewAddress />}
      />

      {addressList && addressList.length > 0 ? (
        addressList.map((item) => (
          <AddressItem
            key={item.id}
            item={item}
            onDelete={() => deleteMutation.mutate(item.id)}
          />
        ))
      ) : (
        <div>No addresses found.</div>
      )}

      {addressList && <AddressPagination addressList={addressList} />}
    </Fragment>
  );
}
