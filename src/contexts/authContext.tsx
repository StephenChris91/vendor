"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

interface AuthContextType {
  user: Session["user"] | null;
  setUser: React.Dispatch<React.SetStateAction<Session["user"] | null>>;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<Session["user"] | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
