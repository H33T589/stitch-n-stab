import type { Metadata } from "next";
import { Nunito, Playfair_Display } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stitchnstab.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Stitch-n-Stab | Funny Handmade Crochet",
  description:
    "Bright, funny, funky handmade crochet by Elaine. Browse one-of-a-kind creations with humor and personality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${playfairDisplay.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
