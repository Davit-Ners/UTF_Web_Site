import { config } from "dotenv";

// Load local variables before scripts import the Prisma client.
config({ path: [".env.local", ".env"], quiet: true });
