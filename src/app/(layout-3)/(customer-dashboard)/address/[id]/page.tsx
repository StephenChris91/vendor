import { Fragment } from "react";
import { Card1 } from "@component/Card1";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import {
  BackToAddress,
  AddressForm,
} from "@sections/customer-dashboard/address";
import { getAddress } from "actions/addresses/getSingleAddress";

interface AddressDetailsProps {
  params: {
    id: string;
  };
}

const AddressDetails = async ({ params }: AddressDetailsProps) => {
  let address;
  let error;

  try {
    address = await getAddress(params.id);
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "An error occurred while fetching the address";
  }

  return (
    <Fragment>
      <DashboardPageHeader
        iconName="pin_filled"
        title="Edit Address"
        button={<BackToAddress />}
      />

      <Card1 borderRadius={8}>
        {error ? (
          <p>Error: {error}</p>
        ) : address ? (
          <AddressForm address={address} />
        ) : (
          <p>Loading...</p>
        )}
      </Card1>
    </Fragment>
  );
};

export default AddressDetails;
