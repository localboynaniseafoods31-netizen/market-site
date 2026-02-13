import type { Metadata } from "next";
import { Manrope, Sora, Space_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Localboynaniseafoods - Premium Seafood Delivery",
  description: "Fresh fish and prawns delivered to your doorstep. Bulk orders available.",
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg', // Optional, if you want it for Apple devices
  },
};

import LocationHeader from "@/components/layout/LocationHeader";
import LocationInitializer from "@/components/common/LocationInitializer";
import BottomNav from "@/components/layout/BottomNav";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased bg-background text-foreground pb-20 md:pb-0`}
      >
        <ReduxProvider>
          <ThemeProvider>
            <LocationInitializer />
            <LocationHeader />

            <main className="min-h-screen pt-14 md:pt-16">
              {children}
            </main>

            <div className="md:hidden">
              <BottomNav />
            </div>
            <Toaster position="top-center" />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

