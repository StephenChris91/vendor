// app/SessionProviderServer.tsx
import { auth } from "auth";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default async function SessionProviderServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // if (!session) redirect("/");

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
