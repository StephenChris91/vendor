import React, { useState, useCallback } from "react";
import Box from "@component/Box";
import { H5 } from "@component/Typography";
import Image from "next/image";
import toast from "react-hot-toast";
import Uploader from "@component/CloudinaryUpload";

interface AddBannerProps {
  updateFormData: (data: { banner: string }) => void;
  initialBanner: string;
  setStepValidation: (isValid: boolean) => void;
  isNextButtonDisabled: () => boolean; // New prop for button state
  handleNext: () => void; // New prop for navigating to the next step
}

const AddBanner: React.FC<AddBannerProps> = ({
  updateFormData,
  initialBanner,
  setStepValidation,
  isNextButtonDisabled,
  handleNext,
}) => {
  const [banner, setBanner] = useState(initialBanner);

  // Callback to handle the uploaded banner URL
  const handleBannerUpload = useCallback(
    (uploadedUrls: string[]) => {
      const uploadedUrl = uploadedUrls[0]; // Expecting one banner image
      setBanner(uploadedUrl);
      updateFormData({ banner: uploadedUrl });
      setStepValidation(true);
      toast.success("Banner uploaded successfully!");
    },
    [updateFormData, setStepValidation]
  );

  return (
    <Box className="content" width="auto" height="auto" paddingBottom={6}>
      <H5
        fontWeight="600"
        fontSize="12px"
        color="gray.800"
        textAlign="center"
        mb="2.25rem"
      >
        Add your shop banner
      </H5>
      {/* Updated Uploader component with proper uploadPreset */}
      <Uploader
        onUploadComplete={handleBannerUpload}
        uploadPreset="vendorspot"
        buttonText="Upload Banner"
      />
      {banner && (
        <Box mt={4} display="flex" justifyContent="center">
          <Image src={banner} alt="Shop Banner" width={600} height={200} />
        </Box>
      )}
    </Box>
  );
};

export default AddBanner;
