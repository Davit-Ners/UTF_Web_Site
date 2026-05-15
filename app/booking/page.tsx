import type { Metadata } from "next";
import BookingClient from "./bookingClient";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Book Until They Fall for clubs, support slots, independent festivals and metal events. Brussels melodic death metal with tech rider ready.",
  alternates: {
    canonical: "/booking",
  },
  openGraph: {
    title: "Book Until They Fall",
    description:
      "Brussels melodic death metal with a tight live set, Belgian stage experience and tech rider ready.",
    url: "/booking",
    images: [
      {
        url: "/gallery/utf-band-good.jpg",
        width: 2048,
        height: 1365,
        alt: "Until They Fall band photo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Until They Fall",
    description:
      "Brussels melodic death metal with a tight live set, Belgian stage experience and tech rider ready.",
    images: ["/gallery/utf-band-good.jpg"],
  },
};

export default function BookingPage() {
  return <BookingClient />;
}
