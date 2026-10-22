import type { Metadata } from "next";
import PhotoBook from "../components/gallery/photoBook/photoBook";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Live photos, stage shots and concert moments from Until They Fall shows.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Until They Fall Gallery",
    description:
      "Stage shots, crowd pressure and live moments from Until They Fall shows.",
    url: "/gallery",
    images: [
      {
        url: "/gallery/band1.jpg",
        width: 2048,
        height: 1329,
        alt: "Until They Fall live on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Until They Fall Gallery",
    description:
      "Stage shots, crowd pressure and live moments from Until They Fall shows.",
    images: ["/gallery/band1.jpg"],
  },
};

export default function GalleryPage() {
  return <PhotoBook />;
}
