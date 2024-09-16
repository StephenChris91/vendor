"use client";

// import { usePathname, useRouter } from "next/navigation";
import { Fragment, PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <Fragment>{children}</Fragment>;
}
