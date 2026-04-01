import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";

type Member = {
  name: string;
  role: string;
  image?: string;
  blurb: string;
  signature: string;
};

const members: Member[] = [
  {
    name: "Davit Nersesyan",
    role: "Lead Guitar",
    image: "/gallery/dav1.jpg",
    blurb:
      "Modern riffs, melodic lead work and part of the visual direction behind the project.",
    signature: "Leads, hooks and atmosphere",
  },
  {
    name: "Sabari Diakite",
    role: "Drums",
    blurb:
      "Precision, double-kick control and the kind of drumming that keeps the whole set sharp live.",
    signature: "Power and control",
  },
  {
    name: "Valentin Coutant",
    role: "Bass",
    image: "/gallery/val1.jpg",
    blurb: "Massive low-end, locked groove and the weight that keeps the songs grounded.",
    signature: "Low-end pressure",
  },
  {
    name: "Kevin Etsrada",
    role: "Rhythm Guitar",
    image: "/gallery/kev1.jpg",
    blurb:
      "Tight rhythm foundations, dense guitar layers and the drive that keeps the set heavy.",
    signature: "Rhythm backbone",
  },
  {
    name: "Krys Bader",
    role: "Vocals",
    blurb:
      "Front-facing energy, screams, hooks and the voice that gives the songs their edge on stage.",
    signature: "Frontline intensity",
  },
];

const highlightCards = [
  {
    title: "Sound",
    body: "Modern melodic death and metalcore tension, built on sharp guitars, hooks and atmosphere.",
  },
  {
    title: "Base",
    body: "Rooted in Brussels and active on the Belgian scene, with a live set ready to travel.",
  },
  {
    title: "Live rig",
    body: "Fast changeover, in-ears and tracks ready for clubs, support slots and festival stages.",
  },
];

const fanRefs = [
  "Melodic death",
  "Metalcore edge",
  "Big choruses",
  "Dark atmosphere",
  "Festival-ready sets",
];

const storyFacts = [
  {
    label: "Base",
    value: "Brussels, Belgium",
  },
  {
    label: "Format",
    value: "5-piece line-up",
  },
  {
    label: "Focus",
    value: "Live impact first",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>About</span>
              <h1 className={styles.title}>
                Modern metal from <span>Brussels</span>
              </h1>
              <p className={styles.subtitle}>
                Until They Fall is a modern metal band blending heavy riffs,
                melodic leads and catchy hooks. Built for the stage, the project
                delivers high-energy shows with a tight, cinematic sound.
              </p>
            </div>

            <div className={styles.heroMedia}>
              <div className={styles.heroImageWrap}>
                <Image
                  src="/utfnez.png"
                  alt="Until They Fall on stage"
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
              <div className={`${styles.heroBadge} card`}>
                <p className={styles.heroBadgeLabel}>Latest release</p>
                <p className={styles.heroBadgeTitle}>Sent To Die</p>
                <p className={styles.heroBadgeMeta}>Debut album · 10 tracks</p>
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
              <h2 className={styles.sectionTitle}>The story</h2>
              <p>
                Formed in Brussels, Until They Fall grew out of a shared obsession
                with modern metal: massive guitars, big choruses and dark
                atmospheres. The band mixes sharp riffs, melodic solos and a
                cinematic sense of dynamics, from tense clean moments to full chaos.
              </p>
              <p>
                On stage, the focus is impact. Tight arrangements, strong
                transitions and a set built to keep the room locked in from the
                first note to the last breakdown.
              </p>
              <p>
                The debut album <strong>Sent To Die</strong> sets the tone:
                melodic death and metalcore influences, modern production, and
                songs written to hit just as hard live as they do on record.
              </p>
            </div>

            <aside className={`${styles.storyMetaCard} card`}>
              <span className={styles.storyMetaEyebrow}>Profile</span>
              <h3 className={styles.storyMetaTitle}>A band shaped around stage pressure.</h3>
              <p className={styles.storyMetaText}>
                The project is built to read clearly in a room: sharp identity,
                direct songs and a setup that translates without extra fluff.
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
              <h2 className={styles.sectionTitle}>The current formation</h2>
            </div>
            <p className={styles.sectionText}>
              Five players, one direction: modern heaviness, melodic lift and a
              live set designed to feel tight, direct and memorable.
            </p>
          </div>

          <div className={styles.lineupShell}>
            <article className={styles.lineupFeature}>
              <div className={styles.lineupFeatureMedia}>
                <Image
                  src="/bandphoto.jpg"
                  alt="Until They Fall band photo"
                  fill
                  sizes="(max-width: 960px) 100vw, 36vw"
                />
              </div>
              <div className={styles.lineupFeatureOverlay} />
              <div className={styles.lineupFeatureBody}>
                <span className={styles.featureTag}>Current line-up</span>
                <h3 className={styles.featureTitle}>Built like a live unit, not a loose collection.</h3>
                <p className={styles.featureText}>
                  The line-up is set around precision, energy and contrast:
                  weight from the rhythm section, melodic lift from the guitars
                  and a vocal front that keeps the songs moving forward.
                </p>
                <div className={styles.featurePills}>
                  <span className={styles.featurePill}>Brussels based</span>
                  <span className={styles.featurePill}>Stage-ready setup</span>
                  <span className={styles.featurePill}>Sent To Die era</span>
                </div>
              </div>
            </article>

            <div className={styles.membersGrid}>
              {members.map((member, index) => (
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
                    <span className={styles.memberIndex}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
              <span className={styles.sectionEyebrow}>Highlights</span>
              <h2 className={styles.statementTitle}>
                Heavy enough for clubs, sharp enough for festival slots.
              </h2>
              <p className={styles.statementText}>
                Until They Fall sits in the lane between modern melodic death,
                metalcore tension and live-first writing. The goal is simple:
                songs that connect fast and a set that lands hard.
              </p>

              <div className={styles.statementActions}>
                <Link href="/music" className="button">
                  Listen to the music
                </Link>
                <Link href="/booking" className={styles.secondaryLink}>
                  Booking info
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
                    <span className={styles.statLabel}>Setup</span>
                    <strong className={styles.statValue}>Clubs + festivals</strong>
                  </div>
                  <div className={styles.statementStat}>
                    <span className={styles.statLabel}>Release</span>
                    <strong className={styles.statValue}>Sent To Die</strong>
                  </div>
                </div>

                <div className={styles.fanBlock}>
                  <h3 className={styles.highlightTitle}>For fans of</h3>
                  <p className={styles.highlightText}>
                    A balance of melody, pressure and songs that still stick
                    after the final hit.
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
