import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";
import {
  fanRefs,
  getInitials,
  highlightCards,
  members,
  storyFacts,
} from "../lib/about";

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>About</span>
              <h1 className={styles.title}>
                Melodic death metal from <span>Brussels</span>
              </h1>
              <p className={styles.subtitle}>
                Formed in 2018, Until They Fall blends aggressive riffs,
                atmospheric melodies and modern metal tension into a sound built
                for both impact and emotion.
              </p>
            </div>

            <div className={styles.heroMedia}>
              <div className={styles.heroImageWrap}>
                <Image
                  src="/gallery/band-test.jpg"
                  alt="Until They Fall"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
              <div className={`${styles.heroBadge} card`}>
                <p className={styles.heroBadgeLabel}>Debut album</p>
                <p className={styles.heroBadgeTitle}>Sent To Die</p>
                <p className={styles.heroBadgeMeta}>Released December 1, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={`${styles.storyCard} card`}>
              <span className={styles.sectionEyebrow}>Story</span>
              <h2 className={styles.sectionTitle}>Brutality, melody, release.</h2>
              <br />
              <p>
                Since 2018, Until They Fall has been fighting for its place in
                the Belgian metal scene. The band&apos;s sound stands between
                melodic death metal, metalcore and technical death, driven by
                aggressive guitars, melodic leads and a powerful rhythm section.
              </p>
              <p>
                The debut album <strong>Sent To Die</strong>, recorded at
                Project Zero Studio, opens a post-apocalyptic world where every
                trial shapes the individual, every fall becomes a chance to rise
                and every fight leaves something stronger behind.
              </p>
              <p>
                Live, the band turns that tension into a shared release:
                intense performances, crowd communion and the feeling of unity
                inside the chaos.
              </p>
            </div>

            <aside className={`${styles.storyMetaCard} card`}>
              <span className={styles.storyMetaEyebrow}>Profile</span>
              <h3 className={styles.storyMetaTitle}>
                A Brussels metal band built for the room.
              </h3>
              <p className={styles.storyMetaText}>
                Heavy riffs, atmospheric melodies and a live set shaped for
                clubs, support slots and independent festivals.
              </p>

              <div className={styles.storyMetaList}>
                {storyFacts.map((item) => (
                  <div key={item.label} className={styles.storyMetaRow}>
                    <span className={styles.storyMetaLabel}>{item.label}</span>
                    <strong className={styles.storyMetaValue}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className={styles.membersSection}>
        <div className="container">
          <div className={styles.membersIntro}>
            <div>
              <span className={styles.sectionEyebrow}>Line-up</span>
              <h2 className={styles.sectionTitle}>The current line-up</h2>
            </div>
          </div>

          <div className={styles.lineupShell}>
            <article className={styles.lineupFeature}>
              <div className={styles.lineupFeatureMedia}>
                <Image
                  src="/gallery/utf-band-good.jpg"
                  alt="Until They Fall band photo"
                  fill
                  sizes="(max-width: 960px) 100vw, 36vw"
                />
              </div>
              <div className={styles.lineupFeatureOverlay} />
              <div className={styles.lineupFeatureBody}>
                <span className={styles.featureTag}>Current line-up</span>
                <h3 className={styles.featureTitle}>
                  Five players, one direction.
                </h3>
                <p className={styles.featureText}>
                  The band is built around contrast: lead guitars carrying the
                  melody, a tight rhythm section pushing the weight forward and
                  vocals made for the front of the stage.
                </p>
                <div className={styles.featurePills}>
                  <span className={styles.featurePill}>Brussels based</span>
                  <span className={styles.featurePill}>Formed in 2018</span>
                  <span className={styles.featurePill}>Sent To Die era</span>
                </div>
              </div>
            </article>

            <div className={styles.membersGrid}>
              {members.map((member) => (
                <article key={member.name} className={`${styles.memberCard} card`}>
                  <div className={styles.memberMedia}>
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      />
                    ) : (
                      <div className={styles.memberFallback}>
                        <span>{getInitials(member.name)}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.memberBody}>
                    <span className={styles.memberRole}>{member.role}</span>
                    <h3 className={styles.memberName}>{member.name}</h3>
                    <p className={styles.memberSignature}>{member.signature}</p>
                    <p className={styles.memberBlurb}>{member.blurb}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.highlightSection}>
        <div className="container">
          <div className={styles.highlightFrame}>
            <article className={styles.highlightLead}>
              <span className={styles.sectionEyebrow}>Identity</span>
              <h2 className={styles.statementTitle}>
                Unity in the chaos.
              </h2>
              <p className={styles.statementText}>
                Until They Fall turns brutality and melody into a live force:
                extreme energy, emotional weight and songs made to bring a room
                together.
              </p>

              <div className={styles.statementActions}>
                <Link href="/music" className="button">
                  Listen Now
                </Link>
                <Link href="/booking" className={styles.secondaryLink}>
                  Book The Band
                </Link>
              </div>
            </article>

            <div className={styles.highlightPanel}>
              <div className={styles.highlightRows}>
                {highlightCards.map((item, index) => (
                  <article key={item.title} className={styles.highlightRow}>
                    <span className={styles.highlightIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.highlightRowBody}>
                      <h3 className={styles.highlightTitle}>{item.title}</h3>
                      <p className={styles.highlightText}>{item.body}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className={styles.highlightFoot}>
                <div className={styles.statementStats}>
                  <div className={styles.statementStat}>
                    <span className={styles.statLabel}>Origin</span>
                    <strong className={styles.statValue}>Brussels, BE</strong>
                  </div>
                  <div className={styles.statementStat}>
                    <span className={styles.statLabel}>Airplay</span>
                    <strong className={styles.statValue}>Classic 21 / Radio Panik</strong>
                  </div>
                  <div className={styles.statementStat}>
                    <span className={styles.statLabel}>Release</span>
                    <strong className={styles.statValue}>Sent To Die</strong>
                  </div>
                </div>

                <div className={styles.fanBlock}>
                  <h3 className={styles.highlightTitle}>For fans of</h3>
                  <p className={styles.highlightText}>
                    Brutal enough to hit, melodic enough to stay.
                  </p>
                  <div className={styles.fanChips}>
                    {fanRefs.map((item) => (
                      <span key={item} className={styles.fanChip}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
