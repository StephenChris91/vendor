import { Dispatch, SetStateAction, ChangeEvent } from "react";
import { ProductType } from "types";

export type FormDataType = ProductType;

export const handleChange = (
  formData: FormDataType,
  setFormData: Dispatch<SetStateAction<FormDataType>>
) => (
  e: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else if (type === "number") {
      setFormData({
        ...formData,
        [name]: Math.max(0, Number(value)), // Ensure no negative numbers
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
