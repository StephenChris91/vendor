// components/admin/AddProductButton.tsx
import React from "react";
import { Button } from "@component/buttons";
import Icon from "@component/icon/Icon";

interface AddProductButtonProps {
  onClick: () => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<Icon>plus</Icon>}
    >
      Add New Product
    </Button>
  );
};

export default AddProductButton;
