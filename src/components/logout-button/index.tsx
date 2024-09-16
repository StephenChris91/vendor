"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Button } from "@component/buttons";
import { useAuth } from "@context/authContext";
import { useCart } from "hooks/useCart"; // Import the useCart hook

interface LogoutButtonProps {
  children?: React.ReactNode;
  onLogout?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  children,
  onLogout,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const { clearCart } = useCart(); // Use the clearCart function from useCart

  const onClick = async () => {
    try {
      setIsLoading(true);

      // Clear the cart
      clearCart();

      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
      setUser(null); // Update the AuthContext
      toast.success("Logged out successfully");
      onLogout?.(); // Call the onLogout prop if it exists
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
