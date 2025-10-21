import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/mobile.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/lib/language-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Capital Transport - Smart Transportation System",
  description: "Professional mobile-first transportation management system for Egypt's Administrative Capital. Real-time tracking, smart booking, and fleet management.",
  keywords: ["Capital Transport", "Smart Transportation", "Administrative Capital", "Egypt", "Bus Management", "Mobile App", "Real-time Tracking"],
  authors: [{ name: "Capital Transport Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Capital Transport - Smart Transportation System",
    description: "Professional mobile-first transportation management system for Egypt's Administrative Capital",
    url: "https://capital-transport.example.com",
    siteName: "Capital Transport",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capital Transport - Smart Transportation System",
    description: "Professional mobile-first transportation management system",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
