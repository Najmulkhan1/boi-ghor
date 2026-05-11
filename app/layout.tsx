import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/layout/Navbar"; // Navbar ইমপোর্ট করা হলো

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Boi Ghor - বই ঘর",
  description: "Read digital books and buy hard copies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50 flex flex-col`} suppressHydrationWarning>
        <AuthProvider>
          <Navbar /> {/* Navbar যুক্ত করা হলো */}
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}