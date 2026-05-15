import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import { getSiteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Until They Fall | Modern Metal From Brussels",
    template: "%s | Until They Fall",
  },
  description:
    "Official Until They Fall website. Concerts, music, gallery, merch and booking for the Brussels modern metal band.",
  applicationName: "Until They Fall",
  keywords: [
    "Until They Fall",
    "metal band",
    "Brussels metal",
    "modern metal",
    "concerts",
    "merch",
    "booking",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Until They Fall",
    title: "Until They Fall | Modern Metal From Brussels",
    description:
      "Concerts, music, gallery, merch and booking for Until They Fall.",
    images: [
      {
        url: "/bandphoto.jpg",
        width: 2048,
        height: 1167,
        alt: "Until They Fall band photo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Until They Fall | Modern Metal From Brussels",
    description:
      "Concerts, music, gallery, merch and booking for Until They Fall.",
    images: ["/bandphoto.jpg"],
  },
  category: "music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" style={{ backgroundColor: "#0a0a0d" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
