import ActionHub from "./components/homePage/actionHub/actionHub";
import FeaturedMerch from "./components/homePage/featuredMerch/featuredMerch";
import FeaturedRelease from "./components/homePage/featuredRelease/featuredRelease";
import FeaturedVideo from "./components/homePage/featuredVideo/featuredVideo";
import Hero from "./components/homePage/hero/hero";
import Live from "./components/homePage/live/live";
import VisualBreak from "./components/homePage/visualBreak/visualBreak";
import { getConcertBuckets, type Concert } from "./lib/concerts";
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

  // null means the fetch failed, which is distinct from zero upcoming shows
  let upcoming: Concert[] | null = null;
  try {
    upcoming = (await getConcertBuckets()).upcoming;
  } catch (error) {
    console.error("Homepage concerts unavailable:", error);
  }

  return (
    <>
      <Hero />

      <FeaturedRelease release={latestRelease} />

      <Live shows={upcoming} />

      <VisualBreak />

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
