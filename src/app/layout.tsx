import Providers from "@utils/providers";
import SessionProviderServer from "@utils/session-provider-server";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
// THEME PROVIDER

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
  return (
    <html lang="en">
      <body className={openSans.className}>
        <SessionProviderServer>
          <Providers>{children}</Providers>
        </SessionProviderServer>
      </body>
    </html>
  );
}
