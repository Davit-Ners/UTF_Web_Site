# Until They Fall — passation release

État vérifié le **26 octobre 2026**. Branche de travail : `redesign/simple-site-v1`.
Direction artistique : `utf-design/design-rules.md`. **Statut final : BLOCKERS REMAIN.**
Le code passe les contrôles ; la configuration de lancement n'est pas encore
entièrement validée. Aucun commit, push, déploiement, envoi de formulaire/email
ou changement de donnée/configuration externe pendant cet audit.

## Resolved — éléments vérifiés

- **Git / secrets :** working tree propre au début de l'audit. 276 fichiers Git
  contrôlés, aucun secret réel détecté, aucun fichier sensible non ignoré, aucun
  scratch/screenshot/cache/dump de données ou artefact accidentel à ajouter.
  `.env*`, `.vercel`, `.next`, client Prisma généré et tsbuildinfo sont ignorés.
  `example.env.example` ne contient que des valeurs vides. Les snapshots dans
  `prisma/audit` sont des preuves historiques intentionnelles de schéma/agrégats,
  sans enregistrement personnel ni credential ; certains servent aux gardes de
  baseline. Ils ne décrivent plus l'état courant après migration.
- **Frontières client/serveur :** seuls `NEXT_PUBLIC_SITE_URL` et
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` sont prévus publics. Aucun accès direct à une
  variable privée dans les composants client ; aucune valeur des secrets locaux
  retrouvée dans les 62 fichiers de bundles/HTML publics du build contrôlés.
- **Production :** Next.js 16.2.2 / Prisma 7.6.0. Vercel `utf-web-site` est
  configuré Next.js, Node 24.x, compatible avec les engines installés. Le
  postinstall génère seulement Prisma ; le build ne migre ni ne seed la DB.
  Les neuf variables applicatives attendues existent pour production/preview
  sur Vercel ; leurs valeurs privées n'ont pas été déchiffrées ni affichées.
- **DB / migrations :** la production Railway est maintenant **à jour** :
  `0_init_pre_idempotency`, `20261023120000_merch_order_idempotency`,
  `20261025120000_booking_idempotency` sont terminées, sans rollback/log d'échec,
  checksums conformes aux fichiers. Diff réel vers `prisma/schema.prisma` vide.
  Les six colonnes nullable et les deux index uniques valides sont présents.
  4 bookings / 2 commandes conservés, aucune clé non NULL dupliquée ni orphelin
  FK. **Ne pas résoudre la baseline à nouveau.** Le plan d'adoption conservé
  dans `prisma/migrations/README.md` est désormais historique pour cette base.
  Vérification READ ONLY ; aucune migration lancée par cet audit final.
- **Formulaires / erreurs :** Booking et Merch utilisent clé/hash/résultat
  d'idempotency et l'unicité PostgreSQL. Tests de perte/rejeu/conflit et de
  sauvegarde/email distincts présents. Une DB indisponible ne produit pas de
  faux succès ; un email échoué après sauvegarde conserve la référence et
  annonce l'avertissement, pas une livraison fictive. Turnstile mal configuré
  échoue en état indisponible. Les états concerts vides, image Merch absente et
  404 sont couverts. Newsletter **désactivée**, aucun formulaire de collecte,
  endpoint 503 avant lecture du body ou écriture DB.
- **SEO / motion / assets :** code SEO validé (apex fixe, canonicals par route,
  robots/sitemap/JSON-LD/404). 43 cas HTTP + 11 routes DOM passent à nouveau,
  22 URLs sitemap, sept images sociales valides, aucun noindex global. R1/R2/R3/
  R4/R6 gelés ; **aucune nouvelle motion avant release**. Hero mobile accepté,
  masters locaux utilisés, Tee sans photo explicitement typographique et
  requestable ; aucun asset local référencé manquant.
- **Sweep :** aucun debugger/console.log métier, mock actif, bypass dev de
  sécurité ou commande reset/drop/truncate/accept-data-loss dans les scripts.
  localhost est limité au mode développement et aux fixtures/audits locaux
  explicitement isolés ; aucun localhost/vercel.app comme origin de production.
  Les logs CLI, tests synthétiques et notes d'assets temporaires sont attendus.
  `db:push`, `db:migrate:dev` et seeds restent des outils manuels de développement,
  hors postinstall/build/deploy ; ne pas les utiliser pour ce lancement Railway.
- **Checks :** suite complète **94 pass / 2 intégrations DB opt-in ignorées**,
  type-check, lint, `git diff --check`, production build passent. Les tests
  API utilisent des mocks ; aucun formulaire réel soumis et aucun email envoyé.

## Launch checklist — blockers et actions avant/après déploiement

### Blockers confirmés / validation manquante

1. **Conflit de domaine Vercel — blocker de déploiement.** L'inspection du projet
   confirme `untiltheyfall.com → www.untiltheyfall.com` ; GET public le confirme
   en **307**, chemin/query conservés. Le code release fait l'inverse :
   `www → apex` en **308**. Le site actuellement déployé sert www en 200, mais
   publier ce code sans corriger le réglage peut créer une boucle apex↔www.
   Dans Vercel, servir directement l'apex et configurer www→apex 308, puis
   vérifier un seul saut avec path/query. **Aucun réglage n'a été modifié.**
2. **Turnstile / readiness Booking.** Le build local utilise une clé publique
   au format invalide avec un secret présent : état `unavailable`, aucun
   contournement. Les variables Vercel existent, mais l'outil ne retourne pas
   leurs valeurs ; validité de la paire et autorisation du hostname final non
   confirmées. Configurer/confirmer une vraie paire pour le domaine apex et
   vérifier le widget après rebuild. Ne pas désactiver la vérification pour
   masquer ce point. Si l'indisponibilité Booking est volontairement acceptée
   pour lancement avec contact email, consigner cette décision explicitement.

### Configuration et contrôle du lancement

- [ ] Résoudre les deux points ci-dessus avant d'annoncer le site/formulaire prêt.
- [ ] Confirmer `DATABASE_URL` de l'environnement qui sera déployé, et garder
      `prisma migrate status` à jour + diff vide ; aucune nouvelle migration à
      appliquer sur la Railway auditée. Ne pas rejouer le plan de baseline.
- [ ] Confirmer `RESEND_API_KEY`, domaine expéditeur vérifié et inboxes
      `BOOKING_TO_EMAIL` / `MERCH_TO_EMAIL` surveillées. Présence vérifiée,
      acheminement réel non testé dans cet audit sans envoi.
- [ ] Après accord sur le commit, déployer le bon projet/branche et rebuild
      avec ses variables de production. L'auth Vercel est limitée aux domaines
      autres que les custom domains ; password/IP protection désactivées lors
      de l'inspection. Vérifier que les URLs publiques restent accessibles.
- [ ] Apex HTTPS 200 ; www→apex 308 unique ; pas de boucle ni noindex de preview.
- [ ] Robots 200 / sitemap apex ; sitemap 200 avec routes indexables et 404 réelles.
- [ ] Google Search Console Domain Property via DNS, soumettre sitemap ; inspecter
      /, /music, /music/sent-to-die, /concerts, /merch, /booking et demander indexation.
- [ ] Valider publiquement le JSON-LD Home / album / concert ; Bing Webmaster Tools
      optionnel. Aucun service externe n'a été configuré par ces audits.
- [ ] **Droits éditoriaux :** confirmations de publication Henoumont, Vangelder,
      auteur de band-test et licences Gerard/artwork restent ouvertes. Les crédits
      ne valent pas permission. Ne pas présenter ce point comme juridiquement résolu.

## Post-launch / P1 / P2 — ne pas mélanger aux bugs de code résolus

- **P0 qualité, non bloquant technique :** poster vidéo actuel YouTube 640×480 ;
  aucun meilleur frame local. Obtenir un export réel 16:9, 1920×1080 minimum.
- **P1 assets :** vraie photo Album Artwork Tee (produit maintenu, sans faux visuel),
  vraie photo stickers, dos/détails tee Gerard, portraits homogènes et masters
  Henoumont propres. Aucun Gerard web/detailed SVG disponible dans ce checkout ;
  garder le WebP actuel. R5 reste différé si un futur asset est encore retenu.
- **P1 icons :** SVG favicon raster enveloppé de 1.84 MB, PNG peu contrasté et
  maskable sans safe-zone suffisante : connus, conservés, pas de nouveau branding.
- **P2 :** variantes/tailles Merch, autres photos de concerts datées/confirmées,
  posters manquants, press pack, nettoyage des copies/mappings/seed assets et AVIF.
  Aucun shooting ni remplacement de photo ne bloque le Hero mobile validé.
- **Contenu à confirmer :** production credits/artwork/Bandcamp ; données horaires,
  line-ups et associations photos de concerts ; Gmail divergent dans presskit.md.
  `contact@untiltheyfall.com` est confirmé surveillé ; aucun remplacement inventé.
- **Organisation / privacy :** identité opérateur commercial toujours à décider
  (membres, membre ou entité), adresse/téléphone/BCE/TVA si applicables ; pas de
  conditions de vente complètes avant ce choix. Les périodes de rétention restent
  des engagements avec suppression manuelle, et les détails fournisseurs/transferts
  à confirmer. Aucun texte legal/privacy modifié dans cet audit.
- **Newsletter :** réactivation dédiée seulement, avec consentement, double opt-in,
  désinscription, preuve et suppression ; ne pas basculer simplement la constante.
- **Rider / press :** téléphones du rider public conservés sur décision explicite
  du groupe ; pas encore de PDF press kit/pack photos public.

## Références conservées

- [Historique complet des phases/audits et questions factuelles](utf-design/archive/passation-history-2026-10-26.md).
- [Plan de migrations, désormais historique pour la production auditée](prisma/migrations/README.md).
- [Preuve de baseline pré-idempotency](prisma/audit/README.md).
- [Règles finales de design/motion](utf-design/design-rules.md).

Les preuves détaillées des audits de cette session sont sous le dossier temporaire
de l'OS, pas dans le prochain commit : scan de secrets, état DB actuel, tests et
HTTP. Aucun fichier .env, credential, screenshot ou dump de données à inclure.
