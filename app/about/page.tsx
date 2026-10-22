import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { festivals, members, sharedBills, type Member } from "@/app/lib/about";
import { SHOW_PHOTO_CREDITS } from "@/app/lib/gallery";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Until They Fall is a melodic death metal band from Brussels, formed in 2018 and built around aggressive riffs, atmospheric melodies and live catharsis.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Until They Fall",
    description:
      "Melodic death metal from Brussels. Brutal, melodic and built for the stage.",
    url: "/about",
    images: [
      {
        url: "/gallery/band-test.jpg",
        width: 2048,
        height: 1363,
        alt: "Until They Fall, the five members posed in an empty room, black and white",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Until They Fall",
    description:
      "Melodic death metal from Brussels. Brutal, melodic and built for the stage.",
    images: ["/gallery/band-test.jpg"],
  },
};

/* Members grouped under the year they joined, in joining order */
function byYear(list: Member[]) {
  const groups = new Map<number, Member[]>();
  for (const member of list) groups.set(member.since, [...(groups.get(member.since) ?? []), member]);
  return Array.from(groups.entries()).sort(([a], [b]) => a - b);
}

export default function AboutPage() {
  let position = 0;

  return (
    <main className={styles.page}>
      {/* I — Cover */}
      <header className={styles.cover}>
        <div className={styles.coverFrame}>
          <Image
            src="/gallery/band-test.jpg"
            alt="Until They Fall, the five members posed in an empty room, black and white"
            width={2048}
            height={1363}
            priority
            sizes="100vw"
            className={styles.coverImage}
          />
        </div>
        <div className={styles.coverText}>
          <h1 className={styles.title}>Until They Fall</h1>
          <p className={`meta ${styles.fact}`}>Brussels, BE — formed 2018</p>
        </div>
      </header>

      {/* II — Story */}
      <section className={styles.story} aria-labelledby="story-title">
        <h2 id="story-title" className={`meta ${styles.label}`}>
          Story
        </h2>
        <p className={styles.lede}>
          Formed in Brussels in 2018, Until They Fall stands at the edge of melodic death metal,
          metalcore and technical death. Driven by aggressive riffs, melodic lead guitars and a
          powerful rhythm section, the band builds a sound that is both brutal and emotional.
        </p>
        <div className={styles.body}>
          <p>
            The debut album, <Link href="/music/sent-to-die">Sent To Die</Link>, was recorded at
            Project Zero Studio and released on December 1, 2023. It explores collapse, resistance
            and the will to rise again. Uprising has aired on Classic 21, and Wrath Of Gaia on
            Radio Panik.
          </p>
          <p>
            Live, the band turns that tension into a shared release: intense performances and crowd
            communion, on stages across Belgium and at independent festivals.
          </p>
        </div>
        <p className={styles.closing}>Unity in the chaos.</p>
      </section>

      {/* III — The band, divided by the year each member joined */}
      <section className={styles.band} aria-labelledby="band-title">
        <h2 id="band-title" className={`meta ${styles.label}`}>
          The band
        </h2>

        {byYear(members).map(([year, group]) => (
          <div key={year} className={styles.year}>
            <p className={styles.yearRule}>
              <span>{year}</span>
            </p>

            {group.map((member) => {
              const side = position++ % 2 === 0 ? styles.imageRight : styles.imageLeft;
              const image = member.image;
              const portrait = image ? image.height > image.width : false;

              return (
                <article
                  key={member.name}
                  className={`${styles.member} ${image ? side : styles.noImage} ${portrait ? styles.portrait : styles.landscape}`}
                >
                  <div className={styles.ident}>
                    <h3 className={styles.name}>{member.name}</h3>
                    <p className={styles.role}>{member.role}</p>
                  </div>

                  {image ? (
                    <figure className={styles.figure}>
                      <span className={styles.frame}>
                        <Image
                          src={image.src}
                          alt={image.alt}
                          width={image.width}
                          height={image.height}
                          sizes={portrait ? "(max-width: 900px) 84vw, 28vw" : "(max-width: 900px) 84vw, 45vw"}
                          className={`${styles.image} ${image.bakedBorder ? styles.trimmed : ""}`}
                        />
                      </span>
                      {SHOW_PHOTO_CREDITS && image.credit ? (
                        <figcaption className={styles.credit}>Photo — {image.credit.name}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                </article>
              );
            })}
          </div>
        ))}
      </section>

      {/* IV — On stage (press-kit data) */}
      <section className={styles.stage} aria-labelledby="stage-title">
        <h2 id="stage-title" className={`meta ${styles.label}`}>
          On stage
        </h2>

        <div className={styles.stageGrid}>
          <div className={styles.stageLists}>
            <div className={styles.stageGroup}>
              <h3 className={`meta ${styles.stageHead}`}>Festivals</h3>
              <ul className={styles.flow}>
                {festivals.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>

            <div className={styles.stageGroup}>
              <h3 className={`meta ${styles.stageHead}`}>Shared bills</h3>
              <ul className={`${styles.flow} ${styles.flowSmall}`}>
                {sharedBills.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>

            <Link href="/concerts#archive" className={`action-link on-bone ${styles.archiveLink}`}>
              Live archive <span className="arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Supporting image only: the baked watermark rules out a full-width use */}
          <figure className={styles.stageFigure}>
            <Image
              src="/gallery/utf-band-good.jpg"
              alt="The five members on a small stage in orange light, the singer in front"
              width={2048}
              height={1536}
              sizes="(max-width: 900px) 100vw, 34vw"
              className={styles.image}
            />
            {SHOW_PHOTO_CREDITS ? (
              <figcaption className={`${styles.credit} ${styles.creditOnBone}`}>Photo — Peter Vangelder</figcaption>
            ) : null}
          </figure>
        </div>
      </section>

      {/* V — End */}
      <nav className={styles.end} aria-label="Continue">
        <Link href="/music" className={styles.endLink}>
          Music <span aria-hidden="true">→</span>
        </Link>
        <Link href="/concerts" className={styles.endLink}>
          Live <span aria-hidden="true">→</span>
        </Link>
        <Link href="/booking" className={styles.endLink}>
          Booking <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </main>
  );
}
