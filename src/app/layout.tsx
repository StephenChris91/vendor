import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
// THEME PROVIDER
import StyledComponentsRegistry from "@lib/registry";
// APP PROVIDER
import { AppProvider } from "@context/app-context";
import StyledContext from "@context/StyledContext";
import { SessionProvider } from "next-auth/react";
import { auth } from "auth";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@context/authContext";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vendorspot | No 1, Multivendor Ecommerce Place",
  description:
    "Vendorspot is an E-commerce Marketplace for all. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{ name: "Stephen Chris", url: "https://stephenchris.com" }],
  keywords: ["e-commerce", "Multivendor ", "next.js", "react", "Vendorspot"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={openSans.className}>
        <SessionProvider session={session}>
          <AppProvider>
            <StyledComponentsRegistry>
              <AuthProvider>
                <StyledContext>{children}</StyledContext>
              </AuthProvider>
            </StyledComponentsRegistry>
            <Toaster />
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
