import ConcertCard from "./components/concertCard/concertCard";
import ActionHub from "./components/homePage/actionHub/actionHub";
import FeaturedMerch from "./components/homePage/featuredMerch/featuredMerch";
import FeaturedRelease from "./components/homePage/featuredRelease/featuredRelease";
import FeaturedVideo from "./components/homePage/featuredVideo/featuredVideo";
import Hero from "./components/homePage/hero/hero";
import SectionHeading from "./components/sectionHeading/sectionHeading";
import { concerts, isPastConcert } from "./lib/concerts";
import { getActiveMerchProducts } from "./lib/merch";

export const revalidate = 60;

export default async function Home() {
  const products = await getActiveMerchProducts(2);

  return (
    <>
      <Hero />

      <ActionHub />

      <FeaturedVideo
        videoId="9Wvpovk_Tg4"
        title="Until They Fall - Sent To Die"
        subtitle="Official Music Video"
      />

      <section className="concertsSection">
        <SectionHeading
          eyebrow="Live"
          title="Upcoming Shows"
          subtitle="Catch us on stage soon. New dates drop regularly â€” donâ€™t miss out."
          cta={{ href: "/concerts", label: "View all" }}
          align="left"
          variant="default"
        />

        <div className="concertsGrid">
          {concerts
            .filter((concert) => !isPastConcert(concert))
            .slice(0, 3)
            .map((concert) => (
              <ConcertCard key={concert.id} concert={concert} />
            ))}
        </div>
      </section>

      <FeaturedRelease
        title="Sent To Die"
        artist="Until They Fall"
        year="2023"
        coverSrc="/album-cover.jpg"
        spotifyId="6HfDbfx8LZCaJzs7gWW8yG"
        spotifyType="album"
        blurb="Melodic Death Metal with catchy hooks and heavy riffs."
        appleUrl="https://music.apple.com/us/album/sent-to-die/1718447538"
        youtubeMusicUrl="https://www.youtube.com/channel/UCIXxu9KHo8HvETKE3oZ0UNA"
      />

      <FeaturedMerch items={products} />
    </>
  );
}
