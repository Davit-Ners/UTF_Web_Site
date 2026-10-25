import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import Footer from "./components/footer/footer";
import Header, { type HeaderTickets } from "./components/header/header";
import { getNextConcert } from "./lib/concerts";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 60;

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

async function getHeaderTickets(): Promise<HeaderTickets | null> {
  try {
    const nextShow = await getNextConcert();
    if (!nextShow?.ticketUrl) return null;

    const [, month, day] = nextShow.date.split("-");
    return { href: nextShow.ticketUrl, date: `${day}.${month}` };
  } catch {
    return null;
  }
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Until They Fall | Melodic Death Metal From Brussels",
    template: "%s | Until They Fall",
  },
  description:
    "Official Until They Fall website. Concerts, music, gallery, merch and booking for the Brussels melodic death metal band.",
  applicationName: "Until They Fall",
  keywords: [
    "Until They Fall",
    "metal band",
    "Brussels metal",
    "melodic death metal",
    "concerts",
    "merch",
    "booking",
  ],
  /* No canonical or og:url here: each route declares its own, so nothing inherits "/" */
  openGraph: {
    type: "website",
    siteName: "Until They Fall",
    title: "Until They Fall | Melodic Death Metal From Brussels",
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
    title: "Until They Fall | Melodic Death Metal From Brussels",
    description:
      "Concerts, music, gallery, merch and booking for Until They Fall.",
    images: ["/bandphoto.jpg"],
  },
  category: "music",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tickets = await getHeaderTickets();

  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${archivo.variable} ${newsreader.variable} ${plexMono.variable}`}
      style={{ backgroundColor: "#0b0b0a" }}
    >
      <body
        className="antialiased"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Header tickets={tickets} />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
