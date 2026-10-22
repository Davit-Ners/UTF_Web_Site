import type { Metadata } from "next";
import TourPoster, { type ConcertData } from "../components/concerts/tourPoster/tourPoster";
import { getConcertBuckets } from "@/app/lib/concerts";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Concerts",
  description:
    "Upcoming shows, live dates and past concerts from Until They Fall, a Brussels melodic death metal band.",
  alternates: {
    canonical: "/concerts",
  },
  openGraph: {
    title: "Concerts | Until They Fall",
    description:
      "Confirmed shows, festival dates and live archive from Brussels melodic death metal band Until They Fall.",
    url: "/concerts",
    images: [
      {
        url: "/gallery/band1.jpg",
        width: 2048,
        height: 1365,
        alt: "Until They Fall live on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Concerts | Until They Fall",
    description:
      "Upcoming shows, live dates and past concerts from Until They Fall.",
    images: ["/gallery/band1.jpg"],
  },
};

export default async function ConcertsPage() {
  let data: ConcertData = null;
  try {
    const { upcoming, past } = await getConcertBuckets();
    data = { upcoming, past };
  } catch (error) {
    console.error("Concerts unavailable:", error);
  }

  return <TourPoster data={data} />;
}
