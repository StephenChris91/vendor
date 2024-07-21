// components/RoleGate.tsx
import React from "react";
import { useSession } from "next-auth/react";

type AllowedRoles = "Admin" | "Vendor" | "Customer";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: AllowedRoles[];
}

export const RoleGate: React.FC<RoleGateProps> = ({
  children,
  allowedRoles,
}) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>; // Or any loading component
  }

  if (status === "unauthenticated") {
    return <div>Access denied. Please log in.</div>; // Or redirect to login
  }

  if (!session?.user?.role) {
    return <div>Access denied. User role not found.</div>;
  }

  if (!allowedRoles.includes(session.user.role as AllowedRoles)) {
    return <div>Access denied. Insufficient permissions.</div>;
  }

  return <>{children}</>;
};
