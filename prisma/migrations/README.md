# Merch order idempotency migration

`20261023120000_merch_order_idempotency/migration.sql` is an additive migration
against the existing `customer_order` table. It adds three nullable columns and
a unique index. Existing orders keep NULL keys; no rows are changed or removed.

Apply the migration before running the updated Merch API, then regenerate the
Prisma client and restart/rebuild the application. Without these database
columns the updated endpoint cannot process orders safely.

This repository had no earlier Prisma migration history. The incremental SQL is
not an initial schema for an empty database. For a populated database managed
without Prisma Migrate, use the existing additive schema-deployment process, or
baseline the existing schema before adopting `prisma migrate deploy`. Do not
reset the existing database to establish migration history.

The migration was verified against a disposable local PostgreSQL database. It
has not been applied to the site's configured database.
