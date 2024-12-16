import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - CricScore",
    default: "CricScore - Cricket Score Management System",
  },
  description: "Professional cricket tournament and series management system",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-background">
          <Navbar />
          <main className="flex-1 container mx-auto px-8 md:px-16 py-8">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
