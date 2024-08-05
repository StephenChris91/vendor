"use client";

import React, { useEffect } from "react";
import MultiStepForm from "lib/useMultistep";
import { FormProvider } from "@context/formcontext";
import { OnboardingStyledRoot, StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H1 } from "@component/Typography";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@component/buttons";
import ShopOnboardingForm from "lib/useMultistep";

const Onboarding = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleRedirect = () => {
    return router.push("/");
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role !== "Vendor") {
        router.push("/profile");
      } else if (session.user.shopStatus === "Approved") {
        router.push("/vendor/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "Vendor") {
    return null; // or redirect to login
  }

  if (session.user.shopStatus === "Pending") {
    return (
      <OnboardingStyledRoot>
        <FlexBox
          height="100vh"
          width="100vw"
          justifyContent="space-between"
          alignItems="center"
          margin="auto"
        >
          <Box
            width="50%"
            height="100%"
            backgroundColor="primary.main"
            display="flex"
            // flexDirection="column"
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
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <H1 color="primary.600" marginBottom={3}>
              Your shop is still pending approval.
            </H1>{" "}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRedirect}
            >
              Return Home
            </Button>
          </Box>
        </FlexBox>
      </OnboardingStyledRoot>
    );
  }

  return (
    <OnboardingStyledRoot>
      <FlexBox
        height="100vh"
        width="100vw"
        justifyContent="space-between"
        alignItems="center"
        margin="auto"
      >
        <Box
          width="50%"
          height="100%"
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
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <FormProvider>
            <ShopOnboardingForm userName="John Doe" userId="123456" />
          </FormProvider>
        </Box>
      </FlexBox>
    </OnboardingStyledRoot>
  );
};

export default Onboarding;
