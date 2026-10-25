-- Additive: existing booking requests remain valid with NULL keys/results.
ALTER TABLE "booking_request"
ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "idempotencyRequestHash" TEXT,
ADD COLUMN "bookingNotificationResult" JSONB;

CREATE UNIQUE INDEX "booking_request_idempotencyKey_key"
ON "booking_request"("idempotencyKey");
