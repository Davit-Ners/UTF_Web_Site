import NewTabLink from "@/app/components/newTabLink";
import { CONTACT_EMAIL } from "@/app/lib/contact";
import {
  APD,
  CLOUDFLARE_TURNSTILE_PRIVACY_URL,
  GOOGLE_PRIVACY_URL,
  RETENTION_MONTHS as months,
  SESSION_KEYS,
} from "./privacyFacts";
import styles from "./privacy.module.css";

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function PolicyFr() {
  return (
    <section id="privacy-fr" lang="fr" className={styles.policy} aria-labelledby="privacy-fr-title">
      <h2 id="privacy-fr-title" className={`meta ${styles.policyTitle}`}>
        Politique de confidentialité — Français
      </h2>

      <div className={styles.body}>
        <h3>Qui sommes-nous</h3>
        <p>
          Ce site est géré par Until They Fall, un groupe de metal de Bruxelles (Belgique). Le groupe
          n&apos;agit pas actuellement par l&apos;intermédiaire d&apos;une entité juridique distincte,
          telle qu&apos;une ASBL ou une société&nbsp;: ses membres sont responsables des traitements
          décrits sur cette page.
        </p>
        <p>Pour toute question ou demande relative à vos données, écrivez à {mail}.</p>

        <h3>En bref</h3>
        <ul>
          <li>Nous n&apos;utilisons aucun outil d&apos;analyse, de publicité ou de suivi des réseaux sociaux.</li>
          <li>
            Nous ne traitons que ce que vous nous envoyez via les formulaires Booking et Merch, ou par
            e-mail.
          </li>
          <li>Le site ne prend aucun paiement en ligne.</li>
          <li>Le lecteur YouTube n&apos;est chargé que lorsque vous appuyez sur Play.</li>
        </ul>

        <h3>Demandes de booking</h3>
        <p>
          <strong>Ce que nous collectons&nbsp;:</strong>{" "}votre nom, votre adresse e-mail, la date souhaitée
          et votre message, qui sont obligatoires. Vous pouvez aussi indiquer la salle, le festival ou
          l&apos;organisateur, le type d&apos;événement, la ville ou le pays, la capacité de la salle et
          une fourchette de budget.
        </p>
        <p>
          <strong>Ce que nous en faisons&nbsp;:</strong>{" "}la demande est enregistrée dans notre base de
          données. Un e-mail reprenant son contenu est envoyé à la boîte du groupe, avec votre adresse
          comme adresse de réponse, et un e-mail de confirmation résumant votre demande vous est
          envoyé. Ces deux e-mails passent par notre prestataire d&apos;envoi, Resend.
        </p>
        <p>
          <strong>Protection anti-spam&nbsp;:</strong>{" "}le formulaire de booking utilise Cloudflare Turnstile
          (voir plus bas). Lorsque vous envoyez le formulaire avec Turnstile actif, notre serveur
          transmet à Cloudflare le jeton de vérification et votre adresse IP afin de confirmer la
          vérification.
        </p>
        <p>
          <strong>Protection contre les doublons&nbsp;:</strong>{" "}votre navigateur conserve une référence
          aléatoire pour la demande que vous envoyez (voir «&nbsp;Cookies et stockage dans le navigateur&nbsp;»).
          Notre serveur enregistre cette référence avec une empreinte (hash) calculée à partir des
          informations envoyées, afin qu&apos;un nouvel envoi de la même demande soit reconnu au lieu
          d&apos;être enregistré deux fois.
        </p>
        <p>
          <strong>Pourquoi&nbsp;:</strong>{" "}pour répondre à votre demande, en discuter avec vous et organiser
          le concert s&apos;il a lieu.
        </p>
        <p>
          <strong>Base légale&nbsp;:</strong>{" "}lorsque vous faites la demande pour vous-même, le traitement
          est nécessaire à l&apos;exécution de mesures précontractuelles prises à votre demande
          (article 6, paragraphe 1, b) du RGPD). Lorsque vous écrivez au nom d&apos;une salle, d&apos;un
          festival ou d&apos;une autre organisation, nous nous fondons sur notre intérêt légitime à
          répondre aux demandes de booking et à organiser des concerts (article 6, paragraphe 1, f) du
          RGPD). Les protections anti-spam et anti-doublons reposent sur notre intérêt légitime à
          garder le formulaire sûr et fiable.
        </p>
        <p>
          Les champs obligatoires sont nécessaires pour traiter votre demande. Si vous préférez ne pas
          utiliser le formulaire, vous pouvez nous écrire directement.
        </p>

        <h3>Demandes de merch</h3>
        <p>
          La page merch ne prend aucun paiement. Lorsque vous envoyez une demande de commande, nous
          recevons une demande, et non un paiement&nbsp;: nous vous contactons ensuite par e-mail au sujet
          de la disponibilité, du paiement et de la livraison.
        </p>
        <p>
          <strong>Ce que nous collectons&nbsp;:</strong>{" "}votre nom, votre adresse e-mail et votre pays, qui
          sont obligatoires, les articles et quantités choisis, ainsi que les remarques que vous
          ajoutez (par exemple une taille, des détails de livraison ou une question). Nous enregistrons
          aussi le sous-total et l&apos;estimation des frais d&apos;envoi calculés, et attribuons un
          numéro de référence à la demande.
        </p>
        <p>
          <strong>Ce que nous en faisons&nbsp;:</strong>{" "}la demande est enregistrée dans notre base de
          données. Un e-mail reprenant son contenu est envoyé à la boîte du groupe et un e-mail de
          confirmation vous est envoyé, tous deux via Resend. La même protection contre les doublons
          que pour le booking s&apos;applique.
        </p>
        <p>
          <strong>Pourquoi et base légale&nbsp;:</strong>{" "}pour traiter votre demande et, si vous donnez
          suite, finaliser la commande avec vous. Ce traitement est nécessaire à l&apos;exécution de
          mesures précontractuelles prises à votre demande et du contrat (article 6, paragraphe 1, b)
          du RGPD). Merci de n&apos;indiquer dans les remarques que ce qui est utile à votre commande.
        </p>

        <h3>Liste de diffusion</h3>
        <p>
          La liste de diffusion n&apos;est pas encore ouverte. Le site n&apos;accepte actuellement
          aucune inscription et aucune newsletter n&apos;est envoyée. Avant son ouverture, nous
          mettrons cette page à jour&nbsp;; l&apos;inscription demandera alors votre consentement
          explicite et la confirmation de votre adresse, et chaque e-mail contiendra un lien de
          désinscription.
        </p>

        <h3>Les e-mails que vous nous envoyez</h3>
        <p>
          Si vous écrivez à {mail}, votre message arrive dans la boîte du groupe via
          l&apos;infrastructure e-mail d&apos;OVH, le prestataire utilisé pour notre domaine. Les
          membres actuels du groupe peuvent le lire. Nous l&apos;utilisons pour vous répondre et donner
          suite à votre demande.
        </p>

        <h3>La vidéo de la page d&apos;accueil</h3>
        <p>
          La page d&apos;accueil affiche une image fixe de notre clip officiel. Cette image est
          récupérée par notre serveur d&apos;hébergement&nbsp;: votre navigateur ne contacte donc pas
          YouTube lorsque vous consultez simplement la page.
        </p>
        <p>
          Le lecteur YouTube n&apos;est chargé que lorsque vous appuyez sur Play. À partir de ce
          moment, la vidéo est diffusée par YouTube (Google) via son service youtube-nocookie.com&nbsp;:
          Google reçoit votre adresse IP et des informations sur votre navigateur, et peut enregistrer
          des identifiants sur votre appareil, comme des cookies ou des technologies similaires,
          conformément à sa propre{" "}
          <NewTabLink href={GOOGLE_PRIVACY_URL}>politique de confidentialité</NewTabLink>. Les autres
          liens vers YouTube sur le site sont de simples liens vers le site de YouTube.
        </p>

        <h3>Cookies et stockage dans le navigateur</h3>
        <ul>
          <li>
            Le site ne dépose aucun cookie qui lui soit propre et n&apos;utilise aucun outil
            d&apos;analyse ou de publicité.
          </li>
          <li>
            <strong>Formulaires Booking et Merch&nbsp;:</strong>{" "}pendant l&apos;envoi d&apos;une demande, le
            stockage de session de votre navigateur conserve une référence aléatoire sous{" "}
            <code>{SESSION_KEYS.booking}</code> (Booking) ou <code>{SESSION_KEYS.merch}</code> (Merch).
            Elle ne contient aucune donnée du formulaire. Elle sert uniquement à éviter qu&apos;une
            même demande soit enregistrée deux fois, par exemple en cas de coupure de connexion. Elle
            est supprimée dès que la demande est enregistrée, et dans tous les cas à la fermeture de
            l&apos;onglet. Ce stockage est strictement nécessaire à la demande que vous envoyez.
          </li>
          <li>
            <strong>Cloudflare Turnstile&nbsp;:</strong>{" "}sur la page Booking, une vérification de sécurité
            permet de distinguer les personnes du spam automatisé. Pour cela, Cloudflare traite des
            informations techniques provenant de votre navigateur, comme votre adresse IP et les
            caractéristiques du navigateur.
          </li>
          <li>
            <strong>YouTube&nbsp;:</strong>{" "}rien n&apos;est chargé depuis YouTube avant que vous appuyiez
            sur Play (voir plus haut).
          </li>
        </ul>
        <p>
          Comme rien de non nécessaire ne s&apos;exécute avant votre choix, le site n&apos;affiche pas
          de bannière cookies.
        </p>

        <h3>Qui reçoit vos données</h3>
        <ul>
          <li>
            <strong>Les membres du groupe&nbsp;:</strong>{" "}les membres actuels peuvent lire la boîte du
            groupe, y compris les notifications de demandes. Le membre qui gère le site a accès à la
            base de données.
          </li>
          <li>
            <strong>Vercel</strong>{" "}héberge le site et exécute ses fonctions serveur. Il traite chaque
            requête adressée au site, y compris les adresses IP et le contenu des formulaires envoyés,
            et conserve des journaux techniques.
          </li>
          <li>
            <strong>Railway</strong>{" "}héberge notre base de données, située dans sa région Irlande (UE).
          </li>
          <li>
            <strong>Resend</strong>{" "}envoie les e-mails de notification et de confirmation et en reçoit
            donc le contenu.
          </li>
          <li>
            <strong>Cloudflare</strong>{" "}fournit Turnstile. Il agit pour notre compte pour sécuriser le
            formulaire de booking et, selon son{" "}
            <NewTabLink href={CLOUDFLARE_TURNSTILE_PRIVACY_URL}>avenant de confidentialité Turnstile</NewTabLink>,
            utilise aussi ces mêmes signaux pour sa propre finalité d&apos;amélioration de sa détection
            des robots, dont il est lui-même responsable.
          </li>
          <li>
            <strong>Google (YouTube)</strong>{" "}ne reçoit des données que si vous appuyez sur Play, en
            tant que responsable du traitement indépendant.
          </li>
          <li>
            <strong>OVH</strong>{" "}fournit l&apos;infrastructure e-mail de notre domaine.
          </li>
        </ul>
        <p>Nous ne vendons pas vos données et ne les partageons pas à des fins publicitaires.</p>

        <h3>Transferts hors de l&apos;Espace économique européen</h3>
        <p>
          Notre base de données se trouve dans l&apos;UE. Vercel, Resend, Cloudflare et Google sont
          établis aux États-Unis&nbsp;: certaines données peuvent donc être traitées en dehors de
          l&apos;Espace économique européen. Les conditions de traitement de Resend prévoient les
          clauses contractuelles types de la Commission européenne. Nous n&apos;avons pas encore
          confirmé les lieux de traitement ni la garantie de transfert utilisés par chacun des autres
          prestataires&nbsp;; nous compléterons cette section dès que ce sera fait.
        </p>

        <h3>Durée de conservation</h3>
        <ul>
          <li>
            <strong>Demandes de booking sans concert&nbsp;:</strong>{" "}supprimées au plus tard{" "}
            {months.bookingWithoutShow} mois après notre dernier échange.
          </li>
          <li>
            <strong>Demandes de booking menant à un concert&nbsp;:</strong>{" "}conservées pendant la
            préparation et le concert, et pour son suivi éventuel, puis supprimées au plus tard{" "}
            {months.bookingAfterShow} mois après le concert.
          </li>
          <li>
            <strong>Demandes de merch non finalisées&nbsp;:</strong>{" "}supprimées au plus tard{" "}
            {months.merchNotCompleted} mois après notre dernier échange.
          </li>
          <li>
            <strong>Commandes de merch finalisées&nbsp;:</strong>{" "}conservées pour la livraison et les
            éventuelles questions de suivi, puis supprimées au plus tard {months.merchAfterDelivery}{" "}
            mois après la livraison.
          </li>
          <li>
            <strong>Données anti-doublons&nbsp;:</strong>{" "}la référence du navigateur est supprimée dès que
            la demande est enregistrée, ou à la fermeture de l&apos;onglet. La référence et
            l&apos;empreinte enregistrées sur notre serveur sont conservées avec la demande qu&apos;elles
            protègent et supprimées avec elle.
          </li>
          <li>
            <strong>Les e-mails</strong>{" "}liés à une demande suivent les mêmes durées que cette demande.
          </li>
          <li>
            <strong>Liste de diffusion&nbsp;:</strong>{" "}aucune inscription n&apos;est actuellement
            acceptée. Avant l&apos;ouverture de la liste, cette page indiquera la durée de conservation
            des inscriptions.
          </li>
          <li>
            <strong>Les journaux techniques</strong>{" "}conservés par nos prestataires suivent leurs
            propres paramètres, que nous n&apos;avons pas encore confirmés.
          </li>
        </ul>
        <p>
          Nous passons en revue les demandes enregistrées au moins une fois par an et supprimons
          celles qui ont dépassé ces durées. Le groupe n&apos;agit pas actuellement par
          l&apos;intermédiaire d&apos;une entité tenant sa propre comptabilité. Si des concerts payés ou
          des ventes de merch nous soumettent plus tard à des obligations comptables ou fiscales de
          conservation, les documents concernés seront conservés pendant la durée prévue par la loi,
          et cette page sera mise à jour.
        </p>

        <h3>Vos droits</h3>
        <p>En vertu du RGPD, vous pouvez nous demander&nbsp;:</p>
        <ul>
          <li>l&apos;accès aux données personnelles que nous détenons à votre sujet et une copie de celles-ci&nbsp;;</li>
          <li>la rectification de données inexactes&nbsp;;</li>
          <li>l&apos;effacement de vos données&nbsp;;</li>
          <li>la limitation de leur traitement&nbsp;;</li>
          <li>
            l&apos;arrêt d&apos;un traitement fondé sur notre intérêt légitime, en vous y opposant pour
            des raisons tenant à votre situation&nbsp;;
          </li>
          <li>
            les données que vous nous avez fournies dans le cadre d&apos;une demande, d&apos;un contrat
            ou de votre consentement, dans un format structuré et couramment utilisé (portabilité)&nbsp;;
          </li>
          <li>
            lorsqu&apos;un traitement repose sur votre consentement, de retirer ce consentement à tout
            moment, sans remettre en cause ce qui a été fait auparavant.
          </li>
        </ul>
        <p>
          Envoyez votre demande à {mail}, de préférence depuis l&apos;adresse utilisée avec nous. Nous
          répondons dans un délai d&apos;un mois. Nous pouvons vous demander des informations pour
          confirmer votre identité. Nous n&apos;utilisons pas vos données pour des décisions
          automatisées ni pour du profilage.
        </p>
        <p>
          Vous avez aussi le droit d&apos;introduire une plainte auprès de l&apos;{APD.nameFr}&nbsp;:{" "}
          {APD.address}, <a href={`mailto:${APD.email}`}>{APD.email}</a>,{" "}
          <NewTabLink href={APD.url}>autoriteprotectiondonnees.be</NewTabLink>. Nous apprécierions
          toutefois de pouvoir d&apos;abord répondre à votre préoccupation.
        </p>

        <h3>Modifications</h3>
        <p>
          Nous mettrons cette page à jour lorsque nos traitements changeront, par exemple avant le
          lancement d&apos;une newsletter. La date en haut de page indique la version en vigueur.
        </p>
      </div>
    </section>
  );
}
