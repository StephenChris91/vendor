"use client";

import React from "react";
import MultiStepForm from "lib/useMultistep";
import { FormProvider } from "@context/formcontext";
import { OnboardingStyledRoot, StyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H1 } from "@component/Typography";

const Onboarding = () => {
  return (
    <OnboardingStyledRoot>
      <FlexBox height="100vh">
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
            <MultiStepForm />
          </FormProvider>
        </Box>
      </FlexBox>
    </OnboardingStyledRoot>
  );
};

export default Onboarding;
