import type { Metadata } from "next";
import Login from "@sections/auth/Login";

export const metadata: Metadata = {
  title: "Login - Vendorspot",
  description: "Vendorspot is the No 1 Ecommerce PLatform",
  authors: [{ name: "Stephen Chris", url: "https://stephenchris.com" }],
  keywords: ["e-commerce", "e-commerce ", "next.js", "react", "vendorspot"],
};

export default function LoginPage() {
  return <Login />;
}
