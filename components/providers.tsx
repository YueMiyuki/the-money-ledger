"use client";

import type React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
        storageKey="money-ledger-theme"
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
