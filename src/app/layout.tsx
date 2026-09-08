import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationDrawer } from "@/components/layout/LocationDrawer";
import { LocationBlockModal } from "@/components/layout/LocationBlockModal";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ThemeSwitcherModal } from "@/components/common/ThemeSwitcherModal";
import ChatWidget from "@/components/chat/ChatWidget";

import { Suspense } from "react";
import { StoreProvider } from "@/store/provider";
import { OAuthCallbackHandler } from "@/components/auth/OAuthCallbackHandler";
import { DisableContextMenu } from "@/components/common/DisableContextMenu";
import { FacebookPixel } from "@/components/analytics/FacebookPixel";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ShymMarket Express — 20 Min Hyperlocal Delivery",
  description: "Order fresh fish, food, grocery, gadgets, and meds in Rangpur Sadar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.className}`}>
      <body className="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen flex flex-col pb-16 md:pb-0">
        <DisableContextMenu />
        <StoreProvider>
          <Suspense fallback={null}>
            <FacebookPixel />
          </Suspense>
          <ThemeProvider>
            <Suspense fallback={null}>
              <OAuthCallbackHandler />
            </Suspense>
            <LocationProvider>
              <CartProvider>
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
                <LocationDrawer />
                <LocationBlockModal />
                <CartDrawer />
                <ThemeSwitcherModal />
                <ChatWidget />
              </CartProvider>
            </LocationProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

