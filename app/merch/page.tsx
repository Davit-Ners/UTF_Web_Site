import type { Metadata } from "next";
import { getActiveMerchProducts } from "../lib/merch";
import type { Product } from "../lib/products";
import MerchView from "./merchView";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Merch",
  description:
    "Official Until They Fall merch catalogue. Send a request directly to the band; availability, shipping and payment are confirmed by email.",
  alternates: { canonical: "/merch" },
  openGraph: {
    title: "Merch | Until They Fall",
    description: "Official Until They Fall merch catalogue. Requests are handled directly with the band by email.",
    url: "/merch",
    images: [{ url: "/merch/cd1.jpg", width: 2048, height: 2048, alt: "Sent To Die CD in its case" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merch | Until They Fall",
    description: "Official Until They Fall merch catalogue. Requests are handled directly with the band by email.",
    images: ["/merch/cd1.jpg"],
  },
};

export default async function MerchPage() {
  let products: Product[] | null = null;
  try {
    products = await getActiveMerchProducts();
  } catch (error) {
    console.error("Merch unavailable:", error);
  }

  return <MerchView products={products} />;
}
