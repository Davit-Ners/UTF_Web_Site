import Link from "next/link";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import { SITE_IDENTITY } from "./legalFacts";
import doc from "../privacy/privacy.module.css";
import styles from "./legal.module.css";

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function LegalFr() {
  return (
    <section id="legal-fr" lang="fr" className={doc.policy} aria-labelledby="legal-fr-title">
      <h2 id="legal-fr-title" className={`meta ${doc.policyTitle}`}>
        Mentions légales — Français
      </h2>

      <div className={doc.body}>
        <h3>Ce site</h3>
        <p>Ce site est le site officiel du groupe Until They Fall.</p>
        <dl className={styles.identity}>
          <div>
            <dt>Groupe</dt>
            <dd>{SITE_IDENTITY.name}</dd>
          </div>
          <div>
            <dt>Basé à</dt>
            <dd>{SITE_IDENTITY.locationFr}</dd>
          </div>
          <div>
            <dt>Contact</dt>
            <dd>{mail}</dd>
          </div>
        </dl>

        <h3>Qui le gère</h3>
        <p>
          Le site est géré par les membres d&apos;Until They Fall. Le groupe n&apos;agit pas
          actuellement par l&apos;intermédiaire d&apos;une entité juridique distincte, telle
          qu&apos;une ASBL ou une société.
        </p>

        <h3>Contact</h3>
        <p>
          Pour toute question sur le site, le booking, le merch ou ces mentions, écrivez à {mail}.
          Cette adresse est lue par le groupe.
        </p>

        <h3>Services techniques</h3>
        <p>
          Les services utilisés pour héberger et faire fonctionner le site, sa base de données et ses
          e-mails sont indiqués dans notre{" "}
          <Link href="/privacy">politique de confidentialité</Link>.
        </p>

        <h3>Nom, logo et contenus</h3>
        <p>
          Sauf mention contraire, le nom et le logo d&apos;Until They Fall ainsi que les textes
          originaux de ce site appartiennent au groupe. Merci de nous demander avant de les
          réutiliser, par exemple pour la presse ou la promotion d&apos;un événement.
        </p>
        <p>
          Les photographies, affiches de concert et visuels réalisés par d&apos;autres restent
          l&apos;œuvre de leurs auteurs. Les photographes sont crédités lorsqu&apos;ils sont connus.
          Les affiches de concert appartiennent aux organisateurs ou aux graphistes qui les ont
          réalisées. Les droits sur ces œuvres restent à leurs titulaires, à qui toute autorisation de
          réutilisation doit être demandée.
        </p>

        <h3>Liens externes</h3>
        <p>
          Les liens vers des services de billetterie, de streaming, de vidéo et de réseaux sociaux
          mènent à des sites gérés par des tiers, soumis à leurs propres conditions et politiques de
          confidentialité.
        </p>

        <h3>Exactitude</h3>
        <p>
          Nous veillons à ce que les dates, lieux et autres informations sur les concerts soient
          aussi exacts que possible, mais ils peuvent changer. Pour les dernières informations sur
          un concert, renseignez-vous auprès de l&apos;organisateur ou du vendeur de billets, ou
          écrivez-nous.
        </p>

        <h3>Vie privée</h3>
        <p>
          La manière dont nous traitons les données personnelles, notamment les demandes de booking
          et de merch, est expliquée dans notre{" "}
          <Link href="/privacy">politique de confidentialité</Link>.
        </p>
      </div>
    </section>
  );
}
