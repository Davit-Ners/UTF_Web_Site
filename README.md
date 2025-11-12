Roadmap MVP (semaine en cours)

Lun (aujourd’hui, 10 nov)

Bootstrapping Next.js (App Router, TS, CSS Modules), structure des pages, Header/Footer/Nav, Hero.

Thème visuel (couleurs/typos), import du logo/mascotte.

Pages vides: Home, Music, Concerts, Merch, Gallery, About, Contact/Booking.

Mar

Home “hero” + hook newsletter (juste un faux POST pour l’instant).

Music: embeds Spotify/YouTube, bloc “dernier single”.

Concerts: liste statique (JSON), cartes + CTA billetterie.
(A7X met “Tour / Mailing list / Discord / Fan club” en très visible, on reprend la logique “actions directes” en Home.) 
avengedsevenfold.com
+1

Mer

Merch (MVP): listing produits (JSON), panier local, Checkout mock.

Préparation Stripe (mode test) — routes API prêtes, pas encore branchées.
(Metallica pousse très fort le store et le fan club dans la nav — on donne un accès Merch au premier niveau.) 
metallica.com
+1

Jeu

Gallery: grille responsive (images locales pour démarrer).

About: bio + membres (photos courtes, rôle, gear).
(Spiritbox a un site très “store-first” clair et direct — utile pour ton Merch.) 
Spiritbox Music, LLC

Ven

Contact/Booking: formulaire (API route), social links, press kit (PDF plus tard).

Finitions UI + micro-animations CSS (hover, focus states).

Weekend

Branche Stripe test / déploiement (Vercel) / DNS / analytics.

Stack & conventions

Next.js (App Router) + TypeScript

CSS Modules (+ variables dans :root) — simple, rapide, maintenable.

Fonts via next/font (ex: Oswald pour titres, Inter pour texte).

Images avec next/image.

State light (panier via Context).

Données MVP en JSON local (concerts, produits) → backend/DB plus tard.

Palette & vibes (UTF)

Proposition sobre/efficace (tu peux me donner tes hex à la place) :

--bg:#0b0b0d (noir bleuté), --surface:#141418, --muted:#2a2a33

--text:#f1f1f3, --subtle:#b3b3bd

Accent sang: --accent:#d92b2b (ou violet sombre #7b2cff si tu préfères cyber)

Glow léger sur CTA + images (métal moderne, pas kitsch).

Commandes de départ
npx create-next-app@latest utf-site \
  --typescript --eslint --app --src-dir --import-alias "@/*"

cd utf-site
npm i

Arborescence proposée
/src
  /app
    /(site)
      /about/page.tsx
      /concerts/page.tsx
      /contact/page.tsx
      /gallery/page.tsx
      /merch/page.tsx
      /music/page.tsx
    /api
      /newsletter/route.ts
      /contact/route.ts
      /checkout/route.ts        // Stripe test (placeholder)
    /layout.tsx
    /globals.css
    /page.tsx                   // Home
  /components
    Header.tsx  Footer.tsx  Nav.tsx  Hero.tsx
    SectionHeading.tsx  Button.tsx
    ConcertCard.tsx  ProductCard.tsx  ProductGrid.tsx
  /lib
    concerts.ts   products.ts
    cart.tsx      (CartContext)
  /assets
    /images (logo, mascotte, hero)
