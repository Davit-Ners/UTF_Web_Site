-- AlterTable
ALTER TABLE "booking_request" ADD COLUMN     "bookingNotificationResult" JSONB,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "idempotencyRequestHash" TEXT;

-- AlterTable
ALTER TABLE "customer_order" ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "idempotencyRequestHash" TEXT,
ADD COLUMN     "merchNotificationResult" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "booking_request_idempotencyKey_key" ON "booking_request"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "customer_order_idempotencyKey_key" ON "customer_order"("idempotencyKey");
