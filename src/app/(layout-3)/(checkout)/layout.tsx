"use client";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, PropsWithChildren, useEffect, useState } from "react";

import Box from "@component/Box";
import Grid from "@component/grid/Grid";
import Stepper from "@component/Stepper";

const steps = ["Cart", "Details", "Payment", "Review"];

export default function Layout({ children }: PropsWithChildren) {
  const [currentStep, setCurrentStep] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    switch (pathname) {
      case "/cart":
        setCurrentStep(0);
        break;
      case "/checkout":
        setCurrentStep(1);
        break;
      case "/payment":
        setCurrentStep(2);
        break;
      case "/orders":
        setCurrentStep(3);
        break;
      default:
        break;
    }
  }, [pathname]);

  return (
    <Fragment>
      <Box mb="14px">
        <Grid container spacing={6}>
          <Grid item lg={8} md={8} xs={12}>
            <Stepper steps={steps} currentStep={currentStep} />
          </Grid>
        </Grid>
      </Box>

      {children}
    </Fragment>
  );
}
