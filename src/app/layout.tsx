import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LocationDrawer } from "@/components/layout/LocationDrawer";
import { LocationBlockModal } from "@/components/layout/LocationBlockModal";
import { CartDrawer } from "@/components/layout/CartDrawer";

import { StoreProvider } from "@/store/provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

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
        <StoreProvider>
          <LocationProvider>
            <CartProvider>
              <Header />
              <div className="flex-1">{children}</div>
              <Footer />
              <LocationDrawer />
              <LocationBlockModal />
              <CartDrawer />
            </CartProvider>
          </LocationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
