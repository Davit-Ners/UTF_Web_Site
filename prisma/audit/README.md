# Audit Prisma / baseline — 2026-10-26

**SAFE TO RESOLVE BASELINE** `0_init_pre_idempotency`, avec nouveau contrôle
de cible/catalogue juste avant exécution. Aucun resolve/deploy Railway, aucune
modification ou export de donnée personnelle de production pendant cet audit.

## État réel de production

PostgreSQL **18.6**, base `railway`, seul schéma applicatif `public`. Session et
transaction READ ONLY vérifiées, isolation REPEATABLE READ ; seuls métadonnées
et agrégats sont conservés.

| Table | Colonnes | Lignes |
| --- | ---: | ---: |
| booking_request | 14 | 4 |
| customer_order | 23 | 2 |
| order_item | 12 | 2 |
| product | 17 | 6 |
| product_variant | 13 | 0 |
| product_image | 9 | 0 |
| inventory_movement | 10 | 0 |
| concert | 25 | 12 |
| concert_image | 10 | 5 |
| concert_lineup_entry | 7 | 9 |
| newsletter_subscriber | 8 | 0 |

**11 tables, 148 colonnes, 13 enums, 35 index** : 11 PK, 5 autres uniques,
19 non uniques ; 10 FK et 91 colonnes NOT NULL. Toutes les contraintes sont
validées ; tous les index sont valides/prêts. Aucun orphelin sur les dix FK.
Aucun CHECK, trigger utilisateur, vue, séquence, routine publique, collation
personnalisée ni politique RLS ; seule extension standard `plpgsql`.

**`_prisma_migrations` n'existe pas.** Aucun historique ni enregistrement échoué
à réconcilier. Le P3005 communiqué est cohérent avec cet état ; aucun deploy
Railway n'a été relancé pour reproduire cette erreur.

Les six colonnes et deux index idempotency sont **tous absents**. L'audit final
retrouve le même catalogue et les mêmes compteurs. Depuis l'ajout du fichier
baseline au dépôt, le vrai migrate status liste actuellement **trois pending** :
baseline + deux migrations datées. Rien n'a été marqué sur Railway.

## Schéma historique et contenu exact de la baseline

[pre-idempotency.prisma](pre-idempotency.prisma) conserve tous les modèles,
enums et relations actuels, en retirant seulement les six champs idempotency.
Son équivalence n'est pas supposée : le diff réel contre Railway produit
[production-to-pre-idempotency.sql](production-to-pre-idempotency.sql), une
**migration vide**, code 0.

Une introspection indépendante est dans
[production-introspected.prisma](production-introspected.prisma). Prisma enrichit
certains noms/defaults côté client depuis le schéma existant ; les attributs
physiques ont donc aussi été confrontés directement à `pg_catalog` dans
[production-catalog.json](production-catalog.json).

**Contenu SQL intégral et exact :**
[../migrations/0_init_pre_idempotency/migration.sql](../migrations/0_init_pre_idempotency/migration.sql).
Il contient :

- le schéma public (création conditionnelle) ;
- 13 enums historiques, dont la valeur physique `ProductBadge: Pre-order` ;
- 11 tables et 148 colonnes avec types/defaults/nullabilités historiques, 11 PK ;
- 5 autres index uniques, 19 index non uniques et 10 FK, avec leurs actions
  ON DELETE/ON UPDATE ;
- **aucun champ/index idempotency, aucune table `_prisma_migrations`, aucune
  insertion, modification/suppression de données ou instruction DROP**.

Génération locale déjà effectuée avec Prisma **7.6.0** :

```powershell
node scripts/prisma-readonly.mjs migrate diff --from-empty --to-schema prisma/audit/pre-idempotency.prisma --script --output prisma/migrations/0_init_pre_idempotency/migration.sql
```

Ne pas exécuter ce SQL sur la production existante, ni le regénérer après son
futur marquage. `0_...` trie la baseline avant les deux migrations datées.
Les snapshots ne servent jamais à générer le client. La baseline représente le
schéma logique ; l'ordre physique historique des colonnes figure dans le
catalogue, mais n'est pas une différence Prisma. Elle ne sauvegarde pas données,
rôles/grants ou infrastructure Railway.

## Diff vers schema.prisma et deux migrations pending inchangées

[production-to-current.sql](production-to-current.sql) ne contient que les
ajouts suivants, équivalents aux deux fichiers existants :

`20261023120000_merch_order_idempotency/migration.sql` :

```sql
-- Additive: existing orders keep NULL keys and remain valid.
ALTER TABLE "customer_order"
ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "idempotencyRequestHash" TEXT,
ADD COLUMN "merchNotificationResult" JSONB;

CREATE UNIQUE INDEX "customer_order_idempotencyKey_key"
ON "customer_order"("idempotencyKey");
```

`20261025120000_booking_idempotency/migration.sql` :

```sql
-- Additive: existing booking requests remain valid with NULL keys/results.
ALTER TABLE "booking_request"
ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "idempotencyRequestHash" TEXT,
ADD COLUMN "bookingNotificationResult" JSONB;

CREATE UNIQUE INDEX "booking_request_idempotencyKey_key"
ON "booking_request"("idempotencyKey");
```

Après les deux ajouts : 154 colonnes et 37 index métier, hors table interne
d'historique Prisma créée par resolve.

## Données existantes et sécurité des nouvelles contraintes

- Aucun nouveau NOT NULL, FK, CHECK, changement d'enum/default, renommage,
  suppression, UPDATE/DELETE ou backfill.
- Les clés n'existent pas en prod : les **2 commandes et 4 bookings** recevront
  NULL dans chaque nouvelle colonne. Aucune clé préexistante ne peut être en
  doublon dans une colonne absente. Aucun nom d'index cible n'est déjà pris.
- Les nouveaux index uniques PostgreSQL standards n'utilisent pas `NULLS NOT
  DISTINCT` : les NULL multiples sont permis. Le rejeu avec plusieurs lignes
  héritées confirme ce comportement ; un doublon non NULL est rejeté (`23505`).
- Toutes les anciennes valeurs restent identiques dans le test ; PK/FK et
  autres index ne changent pas. Aucune donnée personnelle Railway n'a été
  transférée dans l'instance locale.

## Preuve locale

Nouvelle instance locale exclusivement : baseline sur schéma vide, comparaison
directe avec Railway, fixtures synthétiques, puis seul resolve de la baseline.
Comparaison réussie : 148 colonnes (types/defaults/nullabilité), 35 index,
13 enums, 21 contraintes PK/FK. La nullabilité est vérifiée via les colonnes ;
les noms internes des NOT NULL PostgreSQL 18 ne sont pas considérés comme drift.

Status après ce seul resolve **local** :

```text
20261023120000_merch_order_idempotency
20261025120000_booking_idempotency
```

Puis deploy **local seulement** : deux migrations appliquées, trois entrées
d'historique terminées avec leurs checksums, anciennes valeurs préservées,
NULL multiples acceptés, doublons non NULL rejetés. Diff final vide vers
`schema.prisma`. Trace complète : [local-rehearsal.json](local-rehearsal.json).

SHA-256 des octets utilisés pendant le rejeu (tenir compte de la normalisation
CRLF/LF lors d'un futur transfert Git ; ne pas modifier le SQL déjà appliqué) :

| Migration | SHA-256 |
| --- | --- |
| 0_init_pre_idempotency | `18bcf884a13271cb301989a0945ffa58faeb7ca7dc9ec2240cf5746f170d7b34` |
| 20261023120000_merch_order_idempotency | `1338f688d77eeed6f94a3f57fcaf193890698bf917759134f5748ec24718d909` |
| 20261025120000_booking_idempotency | `781249ba0ba5489c3fde42449cfb5003d1a02389661763945c36b7898ee3a4da` |

## API et risques opérationnels

- `/api/booking` réexporte `/api/send`. Ces routes lisent clé/hash/résultat ;
  `/api/merch/order` aussi. Les nouvelles colonnes et index uniques sont
  nécessaires à leur arbitrage concurrent/P2002. Leur code actuel ne doit pas
  être considéré compatible avec l'état pré-idempotency. Aucun POST/email réel.
- ALTER TABLE prend des verrous ; les index ne sont pas créés CONCURRENTLY.
  Les tables sont petites, mais une transaction longue peut retarder
  l'opération : prévoir une courte fenêtre sans écritures.
- Une panne entre ALTER et CREATE INDEX peut laisser un état partiel : inspecter
  historique et catalogue avant reprise, sans marquer applied un contenu absent.
- Confirmer une sauvegarde restaurable récente et la cible d'exécution. Une
  évolution du catalogue après l'audit nécessite un nouveau diff.

**Commandes exactes et points d'arrêt :**
[../migrations/README.md](../migrations/README.md).

Référence officielle : [Prisma baselining](https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining).
Workflow du CLI installé 7.6.0 ; aucune mise à niveau Prisma 8 n'est nécessaire.
