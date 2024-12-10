import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CricScore - Cricket Score Management System",
  description: "Professional cricket tournament and series management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
