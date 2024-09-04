// app/Providers.tsx
"use client";

import { useState } from "react";
import StyledComponentsRegistry from "@lib/registry";
import { AppProvider } from "@context/app-context";
import StyledContext from "@context/StyledContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";
import useIdleTimer from "@component/idleTimer";
import Modal from "@component/Modal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useIdleTimer(3600000, 300000); // Log out after 1 hour of inactivity, with a 5-minute warning

  // useIdleTimer(120000, 60000);

  return (
    <AppProvider>
      <StyledComponentsRegistry>
        <AuthProvider>
          <StyledContext>
            <QueryClientProvider client={queryClient}>
              <Provider>
                {children}
                <Modal />
              </Provider>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </StyledContext>
        </AuthProvider>
      </StyledComponentsRegistry>
      <Toaster />
    </AppProvider>
  );
}
