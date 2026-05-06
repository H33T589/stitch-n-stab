import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stitchnstab.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Stitch-n-Stab | Handmade crochet by Elaine",
  description:
    "One-of-a-kind crochet pieces handmade in British Columbia. Browse the catalog and get in touch for availability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-canvas font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
