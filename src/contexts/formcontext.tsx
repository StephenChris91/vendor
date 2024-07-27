"use client";

import { createContext, useContext, useState } from "react";

interface FormData {
  logo: string;
  shopName: string;
  slug: string;
  description: string;
  coverImage: string;
  paymentInfo: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
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
  const [formData, setFormData] = useState<FormData>({
    logo: "",
    shopName: "",
    slug: "",
    description: "",
    coverImage: "",
    paymentInfo: {
      accountName: "",
      accountNumber: "",
      bankName: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    shopSettings: {
      phoneNumber: "",
      website: "",
      businessHours: "",
      category: "",
      deliveryOptions: [],
      isActive: true,
    },
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      paymentInfo: { ...prev.paymentInfo, ...data.paymentInfo },
      address: { ...prev.address, ...data.address },
      shopSettings: { ...prev.shopSettings, ...data.shopSettings },
    }));
    console.log("Form data updated:", data);
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
