import { useCurrentUser } from "@lib/use-session-client";
import { useCallback, Dispatch, SetStateAction } from "react";
import { ProductType } from "types";

export type FormDataType = ProductType;

export const handleGalleryUpload = async (
  formData: FormDataType,
  setFormData: Dispatch<SetStateAction<FormDataType>>,
  setGalleryFiles: Dispatch<SetStateAction<string[]>>
) => {
  const user = useCurrentUser();

  return useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const response = await fetch("/api/upload-product-gallery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              base64: base64.split(",")[1],
              fileName: file.name,
              userName: user?.name, // Assuming user has a 'name' property
            }),
          });

          const result = await response.json();
          if (response.ok) {
            setGalleryFiles((prevFiles) => [
              ...prevFiles,
              result.url,
            ]);
            // Update formData's gallery
            setFormData((prevFormData) => ({
              ...prevFormData,
              gallery: [...(prevFormData.gallery || []), result.url],
            }));
          } else {
            console.error("Error uploading file:", result.message);
          }
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    [formData, setFormData, setGalleryFiles, user]
  );
};
