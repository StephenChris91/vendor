import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@component/buttons";
import { useFormContext } from "@context/formcontext";
import { useCurrentUser } from "./use-session-client";
import { OnboardingStyledRoot } from "@sections/auth/styles";
import Box from "@component/Box";
import FlexBox from "@component/FlexBox";
import { H3, Paragraph } from "@component/Typography";
import { LogoutButton } from "@component/logout-button";
import { createShop } from "actions/createshop";
import { ShopStatus } from "@prisma/client";
import { signOut } from "next-auth/react";

// Import all step components here
import AddLogo from "@component/onboarding/addLogo";
import AddBasicInfo from "@component/onboarding/addBasicInfo";
import AddCoverImage from "@component/onboarding/addCoverImage";
import AddPaymentInfo from "@component/onboarding/addPaymentInfo";
import AddShopAddress from "@component/onboarding/addShopAddress";
import AddShopSettings from "@component/onboarding/addShopSettings";
import ProcessPayment from "@component/onboarding/processPayment";
import UploadVerificationDocuments from "@component/onboarding/uploadVerificationDocuments";

const steps = [
  { component: AddLogo, label: "Shop Logo" },
  { component: AddBasicInfo, label: "Shop Details" },
  { component: AddCoverImage, label: "Cover Image" },
  { component: AddPaymentInfo, label: "Payment Info" },
  { component: AddShopAddress, label: "Shop Address" },
  { component: AddShopSettings, label: "Shop Settings" },
  { component: ProcessPayment, label: "Make Payment" },
  {
    component: UploadVerificationDocuments,
    label: "Upload Verification Documents",
  },
];

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData } = useFormContext();
  const user = useCurrentUser();
  const [isPaymentProcessed, setPaymentProcessed] = useState(false);
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [documentsUploaded, setDocumentsUploaded] = useState(false);
  const [stepValidation, setStepValidation] = useState(steps.map(() => false));
  const router = useRouter();

  const handleNextStep = () => {
    if (currentStep === 5) {
      setShowPaymentWarning(true);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0 && !isPaymentProcessed) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmPayment = () => {
    setShowPaymentWarning(false);
    setCurrentStep(currentStep + 1);
  };

  const handleFinish = async () => {
    try {
      const shopData = {
        shopName: formData.shopName,
        description: formData.description,
        logo: formData.logo,
        banner: formData.coverImage,
        slug: formData.slug,
        status: ShopStatus.Pending,
        hasPaid: isPaymentProcessed,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          postalCode: formData.address.postalCode,
          country: formData.address.country,
        },
        paymentInfo: {
          accountName: formData.paymentInfo.accountName,
          accountNumber: formData.paymentInfo.accountNumber,
          bankName: formData.paymentInfo.bankName,
        },
        shopSettings: {
          phoneNumber: formData.shopSettings.phoneNumber,
          website: formData.shopSettings.website,
          businessHours: formData.shopSettings.businessHours,
          category: formData.shopSettings.category,
          deliveryOptions: formData.shopSettings.deliveryOptions,
          isActive: formData.shopSettings.isActive,
        },
        categoryName: formData.shopSettings.category,
      };

      const result = await createShop(shopData);

      if (result.status === "success") {
        toast.success("Shop created successfully!");
        await signOut({ redirect: false });
        router.push("/");
      } else {
        console.log(result.status, result.message);
        toast.error(result.message || "Failed to create shop");
      }
    } catch (error) {
      console.error("Error creating shop:", error);
      if (error instanceof Error) {
        toast.error(`Failed to create shop: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const StepComponent = steps[currentStep].component;

  const getStepProps = () => {
    return {
      updateFormData,
      userName: user?.firstname || "",
      userEmail: user?.email || "",
      userId: user?.id || "",
      initialLogo: formData.logo || "",
      initialShopName: formData.shopName || "",
      initialSlug: formData.slug || "",
      initialDescription: formData.description || "",
      initialCoverImage: formData.coverImage || "",
      initialPaymentInfo: formData.paymentInfo || {
        accountName: "",
        accountNumber: "",
        bankName: "",
      },
      initialAddress: formData.address || {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      initialShopSettings: formData.shopSettings || {
        phoneNumber: "",
        website: "",
        businessHours: "",
        category: "",
        deliveryOptions: [],
        isActive: false,
      },
      setPaymentProcessed,
      formData,
      onNextStep: handleNextStep,
      setDocumentsUploaded,
      setStepValidation: (isValid: boolean) => {
        const newStepValidation = [...stepValidation];
        newStepValidation[currentStep] = isValid;
        setStepValidation(newStepValidation);
      },
    };
  };

  if (showPaymentWarning) {
    return (
      <Box padding="2rem" width="100%">
        <H3 textAlign="center" mb="2rem">
          Payment Warning
        </H3>
        <Paragraph mb="2rem">
          Please note that after processing the payment, you will not be able to
          return to previous steps. Make sure all your information is correct
          before proceeding.
        </Paragraph>
        <FlexBox justifyContent="space-between">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setShowPaymentWarning(false)}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmPayment}
          >
            Proceed to Payment
          </Button>
        </FlexBox>
      </Box>
    );
  }

  return (
    <OnboardingStyledRoot>
      <Box padding="2rem" width="100%">
        <H3 textAlign="center" mb="2rem">
          {steps[currentStep].label}
        </H3>

        <Box mb="2rem">
          <StepComponent {...getStepProps()} />
        </Box>

        <FlexBox justifyContent="space-between" mt="2rem">
          {currentStep < 6 && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextStep}
              disabled={
                !stepValidation[currentStep] ||
                (currentStep >= 6 && !isPaymentProcessed)
              }
            >
              {currentStep === steps.length - 2 ? "Submit Documents" : "Next"}
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleFinish}
              disabled={!documentsUploaded}
            >
              Finish
            </Button>
          )}
        </FlexBox>
        <LogoutButton>Logout</LogoutButton>
      </Box>
    </OnboardingStyledRoot>
  );
};

export default MultiStepForm;
