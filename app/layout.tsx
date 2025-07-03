import "@/styles/globals.css";
import { auth } from "@/server/auth";

import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "trpc/react";
import { ThemeProvider } from "@/components/layout/theme/theme-provider";

import { Toaster } from "sonner";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "QuizCraft - AI-Powered Quiz Platform",
  description:
    "Experience the future of learning with AI-generated quizzes powered by Google's Gemini 2.0",
  keywords: ["quiz", "AI", "learning", "education", "Gemini", "multiplayer"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* {process.env.NODE_ENV === "development" && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
            strategy="afterInteractive"
          />
        )} */}
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider session={session}>
            <TRPCReactProvider>
              <Toaster />
              {children}
              <Analytics />
              <SpeedInsights />
            </TRPCReactProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
