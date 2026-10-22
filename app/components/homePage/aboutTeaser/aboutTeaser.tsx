import Image from "next/image";
import Link from "next/link";
import { members } from "@/app/lib/about";
import { IMAGE_BLUR_DATA_URL } from "@/app/lib/imageOptimization";
import styles from "./aboutTeaser.module.css";

/* Copy is reused from /about; the line-up comes from about.ts */
export default function AboutTeaser() {
  return (
    <section className={styles.about} aria-labelledby="about-title">
      <p className={`meta ${styles.index}`}>05 — About</p>

      <figure className={styles.photo}>
        <Image
          src="/gallery/band-test.jpg"
          alt="Until They Fall, the five members posed in an empty room, black and white"
          fill
          sizes="(max-width: 900px) 100vw, 62vw"
          className={styles.image}
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
        />
      </figure>

      <div className={styles.text}>
        <h2 id="about-title" className={styles.statement}>
          Unity in the chaos.
        </h2>
        <p className={styles.intro}>
          Formed in 2018, Until They Fall blends aggressive riffs, atmospheric melodies and
          modern metal tension into a sound built for both impact and emotion.
        </p>

        <dl className={styles.lineup}>
          {members.map((member) => (
            <div key={member.name} className={styles.member}>
              <dt>{member.name}</dt>
              <dd>{member.role}</dd>
            </div>
          ))}
        </dl>

        <Link href="/about" className={`action-link ${styles.more}`}>
          About <span className="arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
