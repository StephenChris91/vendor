// components/LogoutButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Logout } from "actions/logout";
import { Button, IconButton } from "@component/buttons";
interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await Logout();
      toast.success("Logged out successfully");
      // router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      color="primary"
      bg="primary.light"
      px="1rem"
    >
      {isLoading ? "Logging out..." : children || "Logout"}
    </Button>
  );
};
