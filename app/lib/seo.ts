import type { Metadata } from "next";

export const SITE_NAME = "Until They Fall";

export type ShareImage = { url: string; width?: number; height?: number; alt: string };

/* The clean posed line-up photo: no border, no watermark (see passation) */
export const BAND_SHARE_IMAGE: ShareImage = {
  url: "/gallery/band-test.jpg",
  width: 2048,
  height: 1363,
  alt: "Until They Fall, the five members posed in an empty room, black and white",
};

/* Route-specific Open Graph and Twitter metadata, so nothing inherits the homepage */
export function socialMetadata({
  title,
  description,
  path,
  image = BAND_SHARE_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: ShareImage;
}): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { type: "website", siteName: SITE_NAME, title, description, url: path, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
