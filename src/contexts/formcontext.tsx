import { createContext, useContext, useEffect, useState } from "react";

interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state: string;
}

export interface FormData {
  address?: Address;
  logo?: string;
  shopName: string;
  slug: string;
  description: string;
  banner: string;
  paymentInfo: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  shopSettings: {
    phoneNumber: string;
    website: string;
    businessHours: string;
    category: string;
    deliveryOptions: string[];
    isActive: boolean;
  };
}

interface FormContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  currentStep: number; // New state for current step
  setCurrentStep: (step: number) => void; // New function for setting current step
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormData>(() => {
    const storedData = localStorage.getItem("formData");
    return storedData
      ? JSON.parse(storedData)
      : {
          logo: "",
          shopName: "",
          slug: "",
          description: "",
          banner: "",
          paymentInfo: {
            accountName: "",
            accountNumber: "",
            bankName: "",
          },
          address: {
            street: "",
            city: "",
            postalCode: "",
            country: "NG",
            state: "",
          },
          shopSettings: {
            phoneNumber: "",
            website: "",
            businessHours: "",
            category: "",
            deliveryOptions: [],
            isActive: true,
          },
        };
  });

  const [currentStep, setCurrentStep] = useState<number>(() => {
    const storedStep = localStorage.getItem("currentStep");
    return storedStep ? JSON.parse(storedStep) : 0; // Default to step 0
  });

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem("currentStep", JSON.stringify(currentStep));
  }, [currentStep]);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => {
      const newData = { ...prev };
      Object.keys(data).forEach((key) => {
        if (key === "paymentInfo" && data.paymentInfo) {
          newData.paymentInfo = {
            ...prev.paymentInfo,
            ...data.paymentInfo,
          };
        } else if (key === "address" && data.address) {
          newData.address = {
            ...prev.address,
            ...data.address,
          };
        } else if (key === "shopSettings" && data.shopSettings) {
          newData.shopSettings = {
            ...prev.shopSettings,
            ...data.shopSettings,
          };
        } else {
          newData[key] = data[key];
        }
      });
      return newData;
    });
    console.log("Form data updated:", data);
  };

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, currentStep, setCurrentStep }}
    >
      {children}
    </FormContext.Provider>
  );
};
