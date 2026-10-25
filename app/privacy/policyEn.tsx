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

export default function PolicyEn() {
  return (
    <section id="privacy-en" lang="en" className={styles.policy} aria-labelledby="privacy-en-title">
      <h2 id="privacy-en-title" className={`meta ${styles.policyTitle}`}>
        Privacy policy — English
      </h2>

      <div className={styles.body}>
        <h3>Who we are</h3>
        <p>
          This website is run by Until They Fall, a metal band from Brussels, Belgium. The band
          does not currently operate through a separate legal entity, such as a non-profit
          association or a company: its members are responsible for the processing described on
          this page.
        </p>
        <p>For any privacy question or request, write to {mail}.</p>

        <h3>In short</h3>
        <ul>
          <li>We use no analytics, advertising or social-media trackers.</li>
          <li>We only process what you send us through the Booking and Merch forms, or by email.</li>
          <li>The site takes no online payments.</li>
          <li>The YouTube player is only loaded when you press Play.</li>
        </ul>

        <h3>Booking requests</h3>
        <p>
          <strong>What we collect:</strong>{" "}your name, email address, the requested date and your
          message, which are required. You may also give the venue, festival or organiser, the event
          type, the city or country, the venue capacity and a budget range.
        </p>
        <p>
          <strong>What happens to it:</strong>{" "}the request is stored in our database. An email with
          its contents is sent to the band&apos;s inbox, with your address as the reply address, and a
          confirmation email summarising your request is sent to you. Both emails are sent through
          our email provider, Resend.
        </p>
        <p>
          <strong>Spam protection:</strong>{" "}the booking form uses Cloudflare Turnstile (see below). When
          you send the form with Turnstile active, our server sends Cloudflare the verification token
          and your IP address so the check can be confirmed.
        </p>
        <p>
          <strong>Duplicate protection:</strong>{" "}your browser keeps a random reference for the request
          you are sending (see “Cookies and browser storage”). Our server stores that reference with
          a fingerprint (hash) calculated from the details you submitted, so that a retried
          submission is recognised instead of being saved twice.
        </p>
        <p>
          <strong>Why:</strong>{" "}to answer your request, discuss the details with you and organise the
          show if it goes ahead.
        </p>
        <p>
          <strong>Legal basis:</strong>{" "}when you ask on your own behalf, the processing is needed to
          take steps at your request before a possible agreement (Article 6(1)(b) GDPR). When you write
          on behalf of a venue, festival or other organisation, we rely on our legitimate interest in
          answering booking enquiries and organising concerts (Article 6(1)(f) GDPR). Spam and
          duplicate protection rely on our legitimate interest in keeping the form secure and
          reliable.
        </p>
        <p>
          The required fields are needed to handle your request. If you prefer not to use the form,
          you can email us directly.
        </p>

        <h3>Merch requests</h3>
        <p>
          The merch page does not take payments. When you send an order request, we receive a request,
          not a payment: we then contact you by email about availability, payment and delivery.
        </p>
        <p>
          <strong>What we collect:</strong>{" "}your name, email address and country, which are required,
          the items and quantities you selected, and any notes you add (for example a size, delivery
          details or a question). We also record the calculated subtotal and shipping estimate and give
          the request a reference number.
        </p>
        <p>
          <strong>What happens to it:</strong>{" "}the request is stored in our database. An email with its
          contents is sent to the band&apos;s inbox, and a confirmation email is sent to you, both
          through Resend. The same duplicate protection as for booking requests applies.
        </p>
        <p>
          <strong>Why and legal basis:</strong>{" "}to handle your request and, if you go ahead, to
          complete the order with you. This is processing needed to take steps at your request before
          an agreement and to perform it (Article 6(1)(b) GDPR). Please only put in the notes what is
          useful for your order.
        </p>

        <h3>Mailing list</h3>
        <p>
          The mailing list is not open yet. The site does not currently accept sign-ups, and no
          newsletter is sent. Before it opens, we will update this page; signing up will then require
          your explicit consent and a confirmation of your address, and every email will include an
          unsubscribe link.
        </p>

        <h3>Emails you send us</h3>
        <p>
          If you write to {mail}, your message reaches the band&apos;s mailbox through the email
          infrastructure of OVH, the provider used for our domain. Current band members can read it.
          We use it to reply to you and to follow up on what you ask.
        </p>

        <h3>The video on the homepage</h3>
        <p>
          The homepage shows a still image of our official video. That image is fetched by our hosting
          server, so your browser does not contact YouTube while you simply view the page.
        </p>
        <p>
          The YouTube player is only loaded when you press Play. From that moment, the video is
          delivered by YouTube (Google) through its youtube-nocookie.com service: Google receives your
          IP address and information about your browser and may store identifiers on your device,
          such as cookies or similar technologies, under its own{" "}
          <NewTabLink href={GOOGLE_PRIVACY_URL}>privacy policy</NewTabLink>. Links to YouTube elsewhere on
          the site are ordinary links to YouTube&apos;s own website.
        </p>

        <h3>Cookies and browser storage</h3>
        <ul>
          <li>The site sets no cookies of its own and uses no analytics or advertising tools.</li>
          <li>
            <strong>Booking and Merch forms:</strong>{" "}while you send a request, your browser&apos;s
            session storage keeps a random reference under <code>{SESSION_KEYS.booking}</code>{" "}
            (Booking) or <code>{SESSION_KEYS.merch}</code> (Merch). It contains no form details. It
            only prevents the same request from being saved twice, for example if the connection
            drops. It is removed once the request is saved, and in any case when you close the tab.
            This storage is strictly necessary for the request you are sending.
          </li>
          <li>
            <strong>Cloudflare Turnstile:</strong>{" "}on the Booking page, a security check runs to tell
            people from automated spam. To do this, Cloudflare processes technical information from
            your browser, such as your IP address and browser characteristics.
          </li>
          <li>
            <strong>YouTube:</strong>{" "}nothing is loaded from YouTube until you press Play (see above).
          </li>
        </ul>
        <p>
          Because nothing that is not necessary runs before you choose it, the site does not display
          a cookie banner.
        </p>

        <h3>Who receives your data</h3>
        <ul>
          <li>
            <strong>Band members:</strong>{" "}current members can read the band mailbox, including the
            request notifications. The band member who maintains the website has access to the
            database.
          </li>
          <li>
            <strong>Vercel</strong>{" "}hosts the website and runs its server functions. It processes
            every request to the site, including IP addresses and the content of forms you send, and
            keeps technical logs.
          </li>
          <li>
            <strong>Railway</strong>{" "}hosts our database, located in its Ireland (EU) region.
          </li>
          <li>
            <strong>Resend</strong>{" "}sends the notification and confirmation emails and therefore
            receives their content.
          </li>
          <li>
            <strong>Cloudflare</strong>{" "}provides Turnstile. It acts on our behalf to secure the booking
            form and, according to its{" "}
            <NewTabLink href={CLOUDFLARE_TURNSTILE_PRIVACY_URL}>Turnstile privacy addendum</NewTabLink>,
            also uses the same signals for its own purpose of improving its bot detection, for which
            it is responsible itself.
          </li>
          <li>
            <strong>Google (YouTube)</strong>{" "}receives data only if you press Play, as an independent
            controller.
          </li>
          <li>
            <strong>OVH</strong>{" "}provides the email infrastructure for our domain.
          </li>
        </ul>
        <p>We do not sell your data or share it for advertising.</p>

        <h3>Transfers outside the European Economic Area</h3>
        <p>
          Our database is in the EU. Vercel, Resend, Cloudflare and Google are based in the United
          States, so some data may be processed outside the European Economic Area. Resend&apos;s data
          processing terms provide for the European Commission&apos;s Standard Contractual Clauses. We
          have not yet confirmed the processing locations and the transfer safeguard used by each of
          the other providers; we will complete this section once we have.
        </p>

        <h3>How long we keep data</h3>
        <ul>
          <li>
            <strong>Booking requests that do not lead to a show:</strong>{" "}deleted no later than{" "}
            {months.bookingWithoutShow} months after our last exchange.
          </li>
          <li>
            <strong>Booking requests that lead to a show:</strong>{" "}kept while we prepare and play the
            show and deal with any follow-up, then deleted no later than {months.bookingAfterShow}{" "}
            months after the show.
          </li>
          <li>
            <strong>Merch requests that are not completed:</strong>{" "}deleted no later than{" "}
            {months.merchNotCompleted} months after our last exchange.
          </li>
          <li>
            <strong>Completed merch orders:</strong>{" "}kept for delivery and any follow-up questions,
            then deleted no later than {months.merchAfterDelivery} months after delivery.
          </li>
          <li>
            <strong>Duplicate-protection data:</strong>{" "}the browser reference is removed once the
            request is saved, or when the tab is closed. The reference and fingerprint stored on our
            server are kept with the request they protect and deleted with it.
          </li>
          <li>
            <strong>Emails</strong>{" "}about a request follow the same periods as that request.
          </li>
          <li>
            <strong>Mailing list:</strong>{" "}no sign-ups are currently accepted. Before the mailing list
            opens, this page will state how long subscriptions are kept.
          </li>
          <li>
            <strong>Technical logs</strong>{" "}kept by our providers follow their own settings, which we
            have not yet confirmed.
          </li>
        </ul>
        <p>
          We review stored requests at least once a year and delete those past these periods. The band
          does not currently operate through an entity with its own bookkeeping. If paid shows or merch
          sales later make us subject to accounting or tax record-keeping obligations, the records
          concerned will be kept for the period the law requires, and this page will be updated.
        </p>

        <h3>Your rights</h3>
        <p>Under the GDPR, you can ask us:</p>
        <ul>
          <li>for access to the personal data we hold about you and a copy of it;</li>
          <li>to correct inaccurate data;</li>
          <li>to delete your data;</li>
          <li>to restrict its processing;</li>
          <li>
            to stop processing based on our legitimate interests, by objecting on grounds relating to
            your situation;
          </li>
          <li>
            for the data you gave us on the basis of a request or agreement, or of your consent, in a
            structured, commonly used format (portability);
          </li>
          <li>
            where processing relies on your consent, to withdraw that consent at any time, without
            affecting what was done before.
          </li>
        </ul>
        <p>
          Send your request to {mail}, preferably from the address you used with us. We answer within
          one month. We may ask for information to confirm your identity. We do not use your data for
          automated decisions or profiling.
        </p>
        <p>
          You also have the right to complain to the {APD.nameEn}: {APD.address},{" "}
          <a href={`mailto:${APD.email}`}>{APD.email}</a>,{" "}
          <NewTabLink href={APD.url}>autoriteprotectiondonnees.be</NewTabLink>. We would appreciate the
          chance to address your concern first.
        </p>

        <h3>Changes</h3>
        <p>
          We will update this page when our processing changes, for example before a newsletter starts.
          The date at the top shows the current version.
        </p>
      </div>
    </section>
  );
}
