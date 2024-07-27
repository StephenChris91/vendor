"use client";

import { Button } from "@component/buttons";
import { H3, Paragraph } from "@component/Typography";
import Box from "@component/Box";
import { useRouter } from "next/navigation";

const OnboardingConfirmation = () => {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      padding="2rem"
    >
      <H3 mb="1rem">Congratulations!</H3>
      <Paragraph mb="2rem">
        Your shop is now awaiting approval. You will receive a notification via
        email when your shop is approved.
      </Paragraph>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Go to Home Page
      </Button>
    </Box>
  );
};

export default OnboardingConfirmation;
