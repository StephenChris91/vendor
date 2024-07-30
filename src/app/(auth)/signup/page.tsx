import type { Metadata } from "next";
import Signup from "@sections/auth/Signup";

export const metadata: Metadata = {
  title: "Login - Vendorspot",
  description: "Vendorspot is the No 1 Ecommerce PLatform",
  authors: [{ name: "Stephen Chris", url: "https://stephenchris.com" }],
  keywords: ["e-commerce", "e-commerce ", "next.js", "react", "vendorspot"],
};

export default function SignUpPage() {
  return <Signup />;
}
