"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@component/buttons";
import AddBasicInfo from "@component/onboarding/addBasicInfo";
import AddLogo from "@component/onboarding/addLogo";
import AddCoverImage from "@component/onboarding/addCoverImage";
import AddPaymentInfo from "@component/onboarding/addPaymentInfo";
import AddShopAddress from "@component/onboarding/addShopAddress";
import AddShopSettings from "@component/onboarding/addShopSettings";
import ProcessPayment from "@component/onboarding/processPayment";
import { useFormContext } from "@context/formcontext";
import { useCurrentUser } from "./use-session-client";
import { createShop } from "actions/createshop";
import { OnboardingStyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3 } from "@component/Typography";

const steps = [
  { component: AddLogo, label: "Shop Logo" },
  { component: AddBasicInfo, label: "Shop Details" },
  { component: AddCoverImage, label: "Cover Image" },
  { component: AddPaymentInfo, label: "Payment Info" },
  { component: AddShopAddress, label: "Shop Address" },
  { component: AddShopSettings, label: "Shop Settings" },
  { component: ProcessPayment, label: "Make Payment" },
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData } = useFormContext();
  const user = useCurrentUser();
  const [isPaymentProcessed, setPaymentProcessed] = useState(false);
  const StepComponent = steps[currentStep].component;

  const getStepProps = (step: number) => {
    const commonProps = {
      updateFormData,
      userName: user?.firstname || "",
      userEmail: user?.email || "",
      userId: user?.id || "",
    };

    switch (step) {
      case 0:
        return { ...commonProps, initialLogo: formData.logo || "" };
      case 1:
        return {
          ...commonProps,
          initialShopName: formData.shopName || "",
          initialSlug: formData.slug || "",
          initialDescription: formData.description || "",
        };
      case 2:
        return { ...commonProps, initialCoverImage: formData.coverImage || "" };
      case 3:
        return {
          ...commonProps,
          initialPaymentInfo: formData.paymentInfo || {},
        };
      case 4:
        return { ...commonProps, initialAddress: formData.address || {} };
      case 5:
        return {
          ...commonProps,
          initialShopSettings: formData.shopSettings || {},
        };
      case 6:
        return { ...commonProps, setPaymentProcessed };
      default:
        return commonProps;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      const addshop = await createShop(formData);
      if (addshop.status === "success") {
        updateFormData({});
        toast.success(`${addshop.message} 😄`);
        window.location.href = "/";
      } else {
        toast.error(addshop.error || addshop.message || "An error occurred");
      }
      console.log("Submitted data:", formData);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <OnboardingStyledRoot>
      <Box padding="2rem" width="100%">
        <H3 textAlign="center" mb="2rem">
          {steps[currentStep].label}
        </H3>

        <Box mb="2rem">
          <StepComponent {...getStepProps(currentStep)} />
        </Box>

        <FlexBox justifyContent="space-between" mt="2rem">
          <Button
            variant="outlined"
            color="primary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
              disabled={!isPaymentProcessed}
            >
              Finish
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          )}
        </FlexBox>
      </Box>
    </OnboardingStyledRoot>
  );
};

export default MultiStepForm;
