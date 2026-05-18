import type { Metadata } from "next";
import { Manrope, Sora, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LocationHeader from "@/components/layout/LocationHeader";
import LocationInitializer from "@/components/common/LocationInitializer";
import BottomNav from "@/components/layout/BottomNav";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

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
    icon: '/favIcon.svg',
    shortcut: '/favIcon.svg',
    apple: '/favIcon.svg',
  },
  verification: {
    google: "sv5T6Y3mi1OfLRxLnZlu5OTnOtP_2KC1NtA0sRiMm8A",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5KTLS2MS');`}
      </Script>
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} antialiased bg-background text-foreground pb-20 md:pb-0`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5KTLS2MS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
