"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormProvider } from "@context/formcontext";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H1 } from "@component/Typography";
import { Button } from "@component/buttons";
import ShopOnboardingForm from "lib/useMultistep";
import Spinner from "@component/Spinner";
import styled from "styled-components";

const OnboardingStyledRoot = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Onboarding = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pageState, setPageState] = useState("loading");

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "Vendor") {
        router.replace("/profile");
      } else if (session.user.shopStatus === "Approved") {
        router.replace("/vendor/dashboard");
      } else if (session.user.shopStatus === "Pending") {
        setPageState("pending");
      } else {
        setPageState("onboarding");
      }
    } else if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [session, status, router]);

  const OnboardingContent = () => (
    <FlexBox
      height="100%"
      width="100%"
      justifyContent="space-between"
      alignItems="stretch"
    >
      <Box
        width="50%"
        backgroundColor="primary.main"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="3rem"
      >
        <H1
          color="white"
          fontSize={{ xs: "2rem", sm: "3rem", md: "4rem", lg: "5rem" }}
          textAlign="center"
        >
          Onboarding
        </H1>
      </Box>
      <Box
        width="50%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="auto"
      >
        {pageState === "pending" ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <H1 color="primary.600" marginBottom={3}>
              Your shop is still pending approval.
            </H1>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => router.push("/")}
            >
              Return Home
            </Button>
          </Box>
        ) : (
          <FormProvider>
            <ShopOnboardingForm />
          </FormProvider>
        )}
      </Box>
    </FlexBox>
  );

  // if (pageState === "loading") {
  //   return (
  //     <OnboardingStyledRoot>
  //       <Spinner
  //         style={{
  //           position: "absolute",
  //           top: "50%",
  //           left: "50%",
  //           transform: "translate(-50%, -50%)",
  //         }}
  //       />
  //     </OnboardingStyledRoot>
  //   );
  // }

  return (
    <OnboardingStyledRoot>
      <OnboardingContent />
    </OnboardingStyledRoot>
  );
};

export default Onboarding;
