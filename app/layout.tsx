import type { Metadata } from "next";
import { Geist, Geist_Mono, Mulish, Chivo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  // title: "Power",
  description: "Power Gym and Fitness Center",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html>
      <body className={`${mulish.variable} ${chivo.variable} bg-stone-700 flex justify-center`}>
        <Navbar />
        <div className="w-full max-w-3xl bg-background min-h-[calc(100dvh-theme(spacing.12))] mt-12">
          {children}
        </div>
      </body>
    </html>
  );
}
