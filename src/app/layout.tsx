import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stitch-n-Stab | Handmade Crochet",
  description:
    "Handmade crochet products crafted with care. Browse unique, one-of-a-kind creations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${fraunces.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
