import { Dispatch, SetStateAction } from "react";
import { ProductType } from "types";

export type FormDataType = ProductType;

export const generateSKU = (
  formData: FormDataType,
  setFormData: Dispatch<SetStateAction<FormDataType>>
) => {
  const newSKU = Math.floor(Math.random() * 1000000000); // Generate a random number as SKU
  setFormData({
    ...formData,
    sku: newSKU,
  });
};
