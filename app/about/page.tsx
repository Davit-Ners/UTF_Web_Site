import styles from "./about.module.css";
import Image from "next/image";

type Member = {
    name: string;
    role: string;
    image: string;
    blurb: string;
};

const members: Member[] = [
    {
        name: "Davit Nersesyan",
        role: "Lead Guitar",
        image: "/images/members/davit.jpg",
        blurb: "Riffs modernes, leads mélodiques et direction artistique du projet."
    },
    {
        name: "Sabari Diakite",
        role: "Drums",
        image: "/images/members/sabari.jpg",
        blurb: "Patterns modernes, double-pédale et précision live."
    },
    {
        name: "Valentin Coutant",
        role: "Basse",
        image: "/images/members/val.jpg",
        blurb: "Low-end massif et groove serré."
    },
    {
        name: "Kevin Etsrada",
        role: "Rythm Guitar",
        image: "/images/members/kev.jpg",
        blurb: "Patterns modernes, double-pédale et précision live."
    },
    {
        name: "Krys Bader",
        role: "Vocals",
        image: "/images/members/krys.jpg",
        blurb: "Frontman, screams & hooks taillés pour le live."
    }
];

export default function AboutPage() {
    return (
        <main className={styles.page}>
        {/* HERO */}
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

        {/* STORY */}
        <section className={styles.storySection}>
            <div className="container">
            <div className={`${styles.storyCard} card`}>
                <h2 className={styles.sectionTitle}>The story</h2>
                <p>
                Formed in Brussels, Until They Fall grew out of a shared obsession
                for modern metal: massive guitars, big choruses and dark atmospheres.
                The band mixes sharp riffs, melodic solos and a cinematic sense of
                dynamics — from intimate clean parts to full-on chaos.
                </p>
                <p>
                On stage, the band focuses on impact: tight arrangements, strong
                transitions and a show built to keep the crowd locked in from the
                first note to the last breakdown.
                </p>
                <p>
                The debut album <strong>“Sent To Die”</strong> sets the tone:
                melodic death / metalcore influences, modern production,
                and songs written to live both on record and on stage.
                </p>
            </div>
            </div>
        </section>

        {/* MEMBERS */}
        <section className={styles.membersSection}>
            <div className="container">
            <header className={styles.membersHeader}>
                <span className={styles.eyebrow}>Line-up</span>
                <h2 className={styles.sectionTitle}>The band</h2>
            </header>

            <div className={styles.membersGrid}>
                {members.map((m) => (
                <article key={m.image} className={`${styles.memberCard} card`}>
                    <div className={styles.memberAvatar}>
                    <Image
                        src={m.image}
                        alt={m.name}
                        fill
                        sizes="(max-width: 768px) 40vw, 200px"
                    />
                    </div>
                    <div className={styles.memberBody}>
                    <h3 className={styles.memberName}>{m.name}</h3>
                    <p className={styles.memberRole}>{m.role}</p>
                    <p className={styles.memberBlurb}>{m.blurb}</p>
                    </div>
                </article>
                ))}
            </div>
            </div>
        </section>

        {/* HIGHLIGHTS */}
        <section className={styles.highlightSection}>
            <div className="container">
            <div className={styles.highlightGrid}>
                <div className={`${styles.highlightCard} card`}>
                <h3>Sound</h3>
                <p>
                    Modern metal / metalcore with melodic leads, heavy grooves and
                    a strong focus on hooks and atmosphere.
                </p>
                </div>
                <div className={`${styles.highlightCard} card`}>
                <h3>Origin</h3>
                <p>
                    Based in Brussels, BE. Active on the Belgian scene and ready
                    to hit stages across Europe.
                </p>
                </div>
                <div className={`${styles.highlightCard} card`}>
                <h3>Live</h3>
                <p>
                    Full in-ear / tracks rig, fast changeover and a show designed
                    for festivals and clubs.
                </p>
                </div>
                <div className={`${styles.highlightCard} card`}>
                <h3>For fans of</h3>
                <p>
                    Modern metal / metalcore with melodic vocals and big riffs.
                    Think: grosses guitares + refrains qui restent en tête.
                </p>
                </div>
            </div>
            </div>
        </section>
        </main>
    );
};
