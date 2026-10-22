import type { Metadata } from "next";
import { Source_Serif_4, Manrope } from "next/font/google";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "NSBE Unilorin",
  description:
    "University of Ilorin chapter of the National Society of Black Engineers: events, programs and the Academic Hub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
