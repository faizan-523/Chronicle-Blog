import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Chronicle - Modern Design & Technology Blog",
    template: "%s | Chronicle",
  },
  description: "A premium frontend blog platform built with Next.js 14, TypeScript, and Tailwind CSS. Explore tutorials and articles on tech, design, and lifestyle.",
  keywords: ["Blog", "Technology", "Design", "Lifestyle", "Next.js", "Tailwind CSS"],
  authors: [{ name: "Chronicle Team" }],
  creator: "Chronicle Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chronicle-blog.com",
    title: "Chronicle - Modern Design & Technology Blog",
    description: "Explore tutorials and articles on technology, design, and lifestyle.",
    siteName: "Chronicle",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronicle - Modern Design & Technology Blog",
    description: "Explore tutorials and articles on technology, design, and lifestyle.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full bg-slate-50/30 text-gray-900`}
      >
        <Navbar />
        <main className="flex-grow flex flex-col w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
