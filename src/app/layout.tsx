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
  title: "Ocean Fresh - Premium Seafood Delivery",
  description: "Fresh fish and prawns delivered to your doorstep. Bulk orders available.",
};

import Navbar from "@/components/layout/Navbar";
import LocationHeader from "@/components/layout/LocationHeader";
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
            <div className="md:hidden">
              <LocationHeader />
            </div>
            <Navbar />

            <main className="min-h-screen">
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

