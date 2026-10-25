-- Additive: existing orders keep NULL keys and remain valid.
ALTER TABLE "customer_order"
ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "idempotencyRequestHash" TEXT,
ADD COLUMN "merchNotificationResult" JSONB;

CREATE UNIQUE INDEX "customer_order_idempotencyKey_key"
ON "customer_order"("idempotencyKey");
