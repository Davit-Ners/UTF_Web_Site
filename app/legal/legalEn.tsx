import Link from "next/link";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import { SITE_IDENTITY } from "./legalFacts";
import doc from "../privacy/privacy.module.css";
import styles from "./legal.module.css";

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function LegalEn() {
  return (
    <section id="legal-en" lang="en" className={doc.policy} aria-labelledby="legal-en-title">
      <h2 id="legal-en-title" className={`meta ${doc.policyTitle}`}>
        Legal notice — English
      </h2>

      <div className={doc.body}>
        <h3>This website</h3>
        <p>This is the official website of the band Until They Fall.</p>
        <dl className={styles.identity}>
          <div>
            <dt>Band</dt>
            <dd>{SITE_IDENTITY.name}</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>{SITE_IDENTITY.locationEn}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>{mail}</dd>
          </div>
        </dl>

        <h3>Who runs it</h3>
        <p>
          The website is run by the members of Until They Fall. The band does not currently operate
          through a separate legal entity, such as a non-profit association or a company.
        </p>

        <h3>Contact</h3>
        <p>
          For any question about the website, booking, merch or this notice, write to {mail}. This
          address is read by the band.
        </p>

        <h3>Technical services</h3>
        <p>
          The services used to host and run the website, its database and its emails are listed in
          our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h3>Name, logo and content</h3>
        <p>
          Unless stated otherwise, the Until They Fall name and logo and the original texts on this
          website belong to the band. Please ask before reusing them, for example for press or event
          promotion.
        </p>
        <p>
          Photographs, concert posters and artwork made by others remain the work of their authors.
          Photographers are credited where known. Concert posters belong to the organisers or
          designers who made them. Rights in these works stay with their owners, and permission to
          reuse them should be asked from those owners.
        </p>

        <h3>External links</h3>
        <p>
          Links to ticketing, streaming, video and social media services lead to websites run by
          third parties, under their own terms and privacy policies.
        </p>

        <h3>Accuracy</h3>
        <p>
          We keep concert dates, venues and other details as accurate as we can, but they can change.
          For the latest information about a show, check with the organiser or ticket seller, or write
          to us.
        </p>

        <h3>Privacy</h3>
        <p>
          How we handle personal data, including booking and merch requests, is explained in our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </section>
  );
}
