import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";

// const inter = Inter({ subsets: ["latin"] });

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: "Tentiran AI",
  description: "First Multi Modal Model Provider in Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth text-slate-800" lang="en">
      <body className={quicksand.className}>
          {children}
          <Toaster/>
      </body>
    </html>
  );
}
