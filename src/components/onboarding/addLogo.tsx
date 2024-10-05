import React, { useState, useCallback } from "react";
import Box from "@component/Box";
import { H5 } from "@component/Typography";
import Image from "next/image";
import toast from "react-hot-toast";
import Uploader from "@component/CloudinaryUpload";

const AddLogo = ({ updateFormData, initialLogo, setStepValidation }) => {
  const [logo, setLogo] = useState(initialLogo);

  const handleLogoUpload = useCallback(
    (uploadedUrls: string[]) => {
      const uploadedUrl = uploadedUrls[0]; // Expect only one image
      setLogo(uploadedUrl);
      updateFormData({ logo: uploadedUrl });
      setStepValidation(true);
      toast.success("Logo uploaded successfully!");
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
        Add your shop logo
      </H5>
      <Uploader onUploadComplete={handleLogoUpload} uploadPreset="vendorspot" />
      {logo && (
        <Box mt={4} display="flex" justifyContent="center">
          <Image src={logo} alt="Shop Logo" width={200} height={200} />
        </Box>
      )}
    </Box>
  );
};

export default AddLogo;
