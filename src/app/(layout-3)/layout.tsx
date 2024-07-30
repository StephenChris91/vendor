"use client";

import { PropsWithChildren } from "react";
import AppLayout from "@component/layout/layout-3";
import Providers from "@utils/providers";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <AppLayout>{children}</AppLayout>;
    </Providers>
  );
}
