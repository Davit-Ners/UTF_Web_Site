# Prisma — baseline production et migrations idempotency

> **État courant vérifié le 2026-10-26 lors du final pre-deploy audit : base
> Railway à jour.** La baseline et les deux migrations idempotency sont déjà
> enregistrées, terminées et conformes à leurs checksums ; le diff réel vers
> `schema.prisma` est vide. **Ne pas relancer le resolve de baseline sur cette
> base.** La procédure d'adoption ci-dessous est conservée comme historique et
> référence pour une autre base réellement pré-idempotency. L'audit final a
> seulement lu Railway ; il n'a appliqué aucune migration.

Audit du 2026-10-26 : **SAFE TO RESOLVE BASELINE** `0_init_pre_idempotency`.
**Aucun resolve/deploy n'a été exécuté sur Railway pendant cet audit.** Les
commandes d'écriture ci-dessous sont le plan d'une phase ultérieure.

Ne jamais utiliser `migrate reset`, `migrate dev`, `db push`, un drop, une
recréation ou un seed pour établir cet historique. Ne pas exécuter le SQL de
la baseline sur la base existante.

## Fichiers et preuve

- `0_init_pre_idempotency/migration.sql` : contenu intégral de l'état historique
  déjà présent, sans idempotency et sans `_prisma_migrations`, trié en premier.
- `20261023120000_merch_order_idempotency/migration.sql` : trois colonnes
  nullable + un index unique sur `customer_order`, inchangée.
- `20261025120000_booking_idempotency/migration.sql` : trois colonnes nullable +
  un index unique sur `booking_request`, inchangée.
- [Rapport, inventaire, contenu SQL exact et risques](../audit/README.md).

La production correspond au schéma logique pré-idempotency : diff Prisma vide
et comparaison directe de la baseline rejouée avec les colonnes/types/defaults/
nullabilités, enums, PK/FK et index réels. Aucun trigger, vue, séquence, routine
publique, politique RLS ou CHECK supplémentaire n'a été trouvé.

## Plan d'exécution ultérieure — PowerShell à la racine du dépôt

Utiliser le CLI **local 7.6.0**, sans mise à niveau pendant l'opération.
`prisma.config.ts` lit `DATABASE_URL` depuis l'environnement puis `.env.local`/
`.env` ; une variable du shell déjà définie prend priorité. Confirmer la cible
Railway sans publier les secrets. Préparer une sauvegarde restaurable récente
et une courte fenêtre sans écritures Booking/Merch : leur code actuel requiert
les colonnes manquantes.

### 0. Revalider avant toute écriture

```powershell
node scripts/audit-prisma-production.mjs --expect-pre-idempotency prisma/audit/pre-resolve-catalog.json
if ($LASTEXITCODE -ne 0) { throw 'STOP: cible, schema ou historique a change.' }

node scripts/prisma-readonly.mjs migrate diff --from-config-datasource --to-schema prisma/audit/pre-idempotency.prisma --exit-code
if ($LASTEXITCODE -ne 0) { throw 'STOP: le schema reel ne correspond plus a la baseline.' }
```

Le premier script impose une session/transaction PostgreSQL READ ONLY et refuse
une cible/catalogue différent, un historique apparu ou une idempotency partielle.
Il ne lit aucune valeur personnelle. Le diff doit retourner **0 / No difference
detected**. Si un contrôle échoue, arrêter et auditer le nouvel état.

### 1. Marquer uniquement la baseline déjà présente

**Écriture future, non lancée sur Railway pendant l'audit :**

```powershell
npx.cmd --no-install prisma migrate resolve --applied 0_init_pre_idempotency
if ($LASTEXITCODE -ne 0) { throw 'STOP: baseline non resolue.' }

npx.cmd --no-install prisma migrate status
```

`resolve` crée/renseigne `_prisma_migrations` sans exécuter les CREATE de la
baseline. C'est une écriture de métadonnées réservée à la phase d'exécution.

### 2. Point d'arrêt obligatoire avant deploy

Le statut doit annoncer **exactement** :

```text
3 migrations found in prisma/migrations
Following migrations have not yet been applied:
20261023120000_merch_order_idempotency
20261025120000_booking_idempotency
```

Le code de sortie **1** de `migrate status` est attendu avec des pending : lire
le résultat. La baseline doit avoir disparu de la liste ; aucune migration
inconnue, échouée ou divergente ne doit être signalée.

Vérifier aussi `_prisma_migrations` en lecture seule : une seule ligne
`0_init_pre_idempotency`, `finished_at` renseigné, `rolled_back_at` NULL, checksum
correspondant au fichier réellement utilisé. **Ne pas marquer les deux autres
migrations applied : leur contenu est absent de la production auditée.**

```powershell
node scripts/audit-prisma-production.mjs --expect-baseline-only prisma/audit/post-resolve-catalog.json
if ($LASTEXITCODE -ne 0) { throw 'STOP: historique baseline ou catalogue inattendu.' }
```

Ce garde-fou vérifie automatiquement la seule entrée baseline et son checksum,
l'absence des nouveaux champs/index et le catalogue métier inchangé, hors
table interne `_prisma_migrations`. Il ne marque rien lui-même.

### 3. Appliquer les deux ajouts, seulement après validation du point 2

**Écritures futures, non lancées sur Railway pendant l'audit :**

```powershell
npx.cmd --no-install prisma migrate deploy
if ($LASTEXITCODE -ne 0) { throw 'STOP: inspecter historique et colonnes; ne pas contourner avec resolve.' }

npx.cmd --no-install prisma migrate status
if ($LASTEXITCODE -ne 0) { throw 'STOP: verifier le statut final avant reprise.' }

npx.cmd --no-install prisma generate
if ($LASTEXITCODE -ne 0) { throw 'STOP: client non genere.' }
```

Attendu : deploy applique seulement les deux migrations datées ; status retourne
0 et « Database schema is up to date! ». Generate utilise le `schema.prisma`
applicatif, pas les snapshots d'audit.

Contrôles finaux en lecture seule :

```powershell
node scripts/prisma-readonly.mjs migrate diff --from-config-datasource --to-schema prisma/schema.prisma --exit-code
if ($LASTEXITCODE -ne 0) { throw 'STOP: drift apres migration.' }

node scripts/audit-prisma-production.mjs prisma/audit/post-deploy-catalog.json
```

Attendre trois migrations terminées, six colonnes nullable et deux index uniques
valides, aucune clé non NULL dupliquée et aucune perte des anciennes lignes.
Comparer les compteurs à ceux de la fenêtre sans écritures. Puis rebuild/
redémarrage de l'application et reprise des formulaires ; aucun faux POST en
production pour tester.

Une panne entre ALTER et CREATE INDEX peut laisser un état partiel. Ne pas
rejouer aveuglément, éditer le SQL ou résoudre applied un contenu absent :
inspecter d'abord l'historique et les objets réellement présents.

## Vérification déjà faite uniquement en local

Une nouvelle instance PostgreSQL sur `127.0.0.1:55439` a reçu la baseline et des
fixtures synthétiques. Le seul resolve baseline y a laissé exactement les deux
pending attendues. Leur deploy local a préservé les anciennes valeurs, accepté
plusieurs NULL et refusé les doublons non NULL ; diff final vide vers le schéma
actuel. Preuve : `prisma/audit/local-rehearsal.json`.

`scripts/verify-prisma-baseline.mjs` est verrouillé sur cette cible localhost et
exige un schéma public vide. Il ne charge jamais l'URL Railway et n'utilise
aucun reset/drop. L'instance de test peut être arrêtée sans supprimer son dossier.

Référence officielle : [Prisma baselining](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining).
Les deux migrations existantes sont conservées ; ne pas supprimer leur historique
en recopiant le cas générique de la documentation.
