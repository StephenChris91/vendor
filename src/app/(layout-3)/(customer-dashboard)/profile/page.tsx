"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@component/Box";
import Card from "@component/Card";
import Avatar from "@component/avatar";
import Grid from "@component/grid/Grid";
import FlexBox from "@component/FlexBox";
import TableRow from "@component/TableRow";
import Typography, { H3, H5, Small } from "@component/Typography";
import DashboardPageHeader from "@component/layout/DashboardPageHeader";
import { EditProfileButton } from "@sections/customer-dashboard/profile";
import { useCurrentUser } from "@lib/use-session-client";
import { getCustomerProfile } from "actions/customer";

export default function Profile() {
  const user = useCurrentUser();

  const {
    data: customerProfile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["customerProfile", user?.id],
    queryFn: () => getCustomerProfile(user?.id),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile: {(error as Error).message}</div>;
  }

  if (!customerProfile) {
    return <div>No profile data available</div>;
  }

  const infoList = [
    {
      title: customerProfile.orderCounts.total.toString(),
      subtitle: "All Orders",
    },
    {
      title: customerProfile.orderCounts.awaitingPayment.toString(),
      subtitle: "Awaiting Payments",
    },
    {
      title: customerProfile.orderCounts.awaitingShipment.toString(),
      subtitle: "Awaiting Shipment",
    },
    {
      title: customerProfile.orderCounts.awaitingDelivery.toString(),
      subtitle: "Awaiting Delivery",
    },
  ];

  return (
    <Fragment>
      <DashboardPageHeader
        title="My Profile"
        iconName="user_filled"
        button={<EditProfileButton />}
      />

      <Box mb="30px">
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <FlexBox
              as={Card}
              p="14px 32px"
              height="100%"
              borderRadius={8}
              alignItems="center"
            >
              <Avatar src={customerProfile.image || ""} size={64} />

              <Box ml="12px" flex="1 1 0">
                <FlexBox
                  flexWrap="wrap"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <div>
                    <H5 my="0px">{`${customerProfile.firstname} ${customerProfile.lastname}`}</H5>

                    <FlexBox alignItems="center">
                      <Typography fontSize="14px" color="text.hint">
                        Cart Items:
                      </Typography>

                      <Typography ml="4px" fontSize="14px" color="primary.main">
                        {customerProfile.cartItemsCount}
                      </Typography>
                    </FlexBox>
                  </div>

                  <Typography
                    fontSize="14px"
                    color="text.hint"
                    letterSpacing="0.2em"
                  >
                    {customerProfile.role}
                  </Typography>
                </FlexBox>
              </Box>
            </FlexBox>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Grid container spacing={4}>
              {infoList.map((item) => (
                <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                  <FlexBox
                    as={Card}
                    height="100%"
                    p="1rem 1.25rem"
                    borderRadius={8}
                    alignItems="center"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <H3 color="primary.main" my="0px" fontWeight="600">
                      {item.title}
                    </H3>

                    <Small color="text.muted" textAlign="center">
                      {item.subtitle}
                    </Small>
                  </FlexBox>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableRow p="0.75rem 1.5rem">
        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            First Name
          </Small>

          <span>{customerProfile.firstname}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Last Name
          </Small>

          <span>{customerProfile.lastname}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Email
          </Small>

          <span>{customerProfile.email}</span>
        </FlexBox>

        <FlexBox flexDirection="column" p="0.5rem">
          <Small color="text.muted" mb="4px">
            Phone
          </Small>

          <span>N/A</span>
        </FlexBox>
      </TableRow>
    </Fragment>
  );
}
