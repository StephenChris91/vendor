import React, { useState, useCallback } from "react";
import Box from "@component/Box";
import { H5 } from "@component/Typography";
import DropZone from "@component/DropZone";
import Image from "next/image";
import toast from "react-hot-toast";

interface AddLogoProps {
  updateFormData: (data: { logo: string }) => void;
  initialLogo: string;
  setStepValidation: (isValid: boolean) => void;
}

const AddLogo: React.FC<AddLogoProps> = ({
  updateFormData,
  initialLogo,
  setStepValidation,
}) => {
  const [logo, setLogo] = useState(initialLogo);

  const handleLogoUpload = useCallback(
    async (file: File) => {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/shop-logo", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.url) {
          setLogo(result.url);
          updateFormData({ logo: result.url });
          setStepValidation(true);
          toast.success("Logo uploaded successfully!");
        } else {
          throw new Error("No URL returned from server");
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        toast.error("Failed to upload logo. Please try again.");
      }
    },
    [updateFormData, setStepValidation]
  );

  const handleAuthError = useCallback(() => {
    toast.error("Authentication failed. Please log in again.");
    // Implement any logic to handle auth errors, like redirecting to login page
  }, []);

  return (
    <Box className="content" width="auto" height="auto" paddingBottom={6}>
      <H5
        fontWeight="600"
        fontSize="12px"
        color="gray.800"
        textAlign="center"
        mb="2.25rem"
      >
        Add your shop logo
      </H5>

      <DropZone
        uploadType="shop-logo"
        onUpload={handleLogoUpload}
        onAuthError={handleAuthError}
        acceptedFileTypes={{
          "image/*": [".png", ".jpg", ".jpeg", ".gif"],
        }}
        maxSize={5 * 1024 * 1024} // 5MB
      />

      {logo && (
        <Box mt={4} display="flex" justifyContent="center">
          <Image src={logo} alt="Shop Logo" width={200} height={200} />
        </Box>
      )}
    </Box>
  );
};

export default AddLogo;
