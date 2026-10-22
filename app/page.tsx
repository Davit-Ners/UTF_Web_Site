import ActionHub from "./components/homePage/actionHub/actionHub";
import FeaturedMerch from "./components/homePage/featuredMerch/featuredMerch";
import FeaturedRelease from "./components/homePage/featuredRelease/featuredRelease";
import FeaturedVideo from "./components/homePage/featuredVideo/featuredVideo";
import Hero from "./components/homePage/hero/hero";
import { getActiveMerchProducts } from "./lib/merch";
import { latestRelease } from "./lib/music";

export const revalidate = 60;

export default async function Home() {
  let products: Awaited<ReturnType<typeof getActiveMerchProducts>> = [];
  try {
    products = await getActiveMerchProducts(2);
  } catch (error) {
    console.error("Homepage merch unavailable:", error);
  }

  return (
    <>
      <Hero />

      <FeaturedRelease release={latestRelease} />

      <ActionHub />

      <FeaturedVideo
        videoId="9Wvpovk_Tg4"
        title="Until They Fall - Sent To Die"
        eyebrow="Official Video"
        subtitle="The official video from Sent To Die. Heavy, melodic and built around the album’s darker edge."
      />

      <FeaturedMerch items={products} />
    </>
  );
}
