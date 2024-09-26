import React, { useState } from "react";
import Box from "@component/Box";
import { H5 } from "@component/Typography";
import DropZone from "@component/DropZone";
import Image from "next/image";

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

  const handleLogoUpload = (url: string) => {
    setLogo(url);
    updateFormData({ logo: url });
    setStepValidation(true);
  };

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
        onUpload={(url) => handleLogoUpload(url)}
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
