import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { cloakSSROnlySecret } from "ssr-only-secrets";

import { cn } from "@ragnotes/ui";
import { Toaster } from "@ragnotes/ui/sonner";
import { ThemeProvider } from "@ragnotes/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "AI Notes",
  description: "AI RAG Notes",
  openGraph: {
    title: "AI Notes",
    description: "AI RAG Notes",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "AI Notes",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default async function RootLayout(props: { children: React.ReactNode }) {
  // Encrypt cookie for SSR-only access
  // https://github.com/t3-oss/create-t3-app/issues/1765#issuecomment-2141137459
  const cookie = new Headers(await headers()).get("cookie");
  const encryptedCookie = await cloakSSROnlySecret(
    cookie ?? "",
    "SSR_SECRET_KEY",
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-muted font-sans text-foreground antialiased",
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NuqsAdapter>
              <TRPCReactProvider ssrOnlySecret={encryptedCookie}>
                {props.children}
              </TRPCReactProvider>
            </NuqsAdapter>
            <Toaster richColors />
          </ThemeProvider>
          <SpeedInsights />
        </>
      </body>
    </html>
  );
}
