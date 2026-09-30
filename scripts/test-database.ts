import "./load-env";
import prisma from "../lib/prisma";

async function main() {
  console.log("Testing Prisma connection...");

  await prisma.$connect();

  const rows = await prisma.$queryRaw<Array<{ result: number }>>`
    SELECT 1 AS result
  `;

  console.log("Prisma connection OK.");
  console.log(`Ping result: ${rows[0]?.result ?? "unknown"}`);
}

main()
  .catch((error) => {
    console.error("Prisma connection failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
