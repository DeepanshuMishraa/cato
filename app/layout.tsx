import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Appbar from "@/components/Appbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import QueryProvider from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "cato",
  description: "Monitor your website uptime",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${inter.className} antialiased`}
      >
        <QueryProvider>
          <Appbar />
          {children}
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>

    </html>
  );
}
