import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Load .env FIRST - before any code accesses process.env
dotenv.config();

/**
 * Prisma Client Singleton for Serverless Environments (Vercel)
 *
 * Prisma 7+ uses adapter-based connections. This setup uses @prisma/adapter-pg
 * to connect to PostgreSQL.
 *
 * Key points:
 * - globalThis persists across module reloads in Node.js
 * - We cache in BOTH development and production for Vercel serverless
 * - The pg Pool is configured for serverless (limited connections)
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: pg.Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is required. " +
      "Set it in your .env file locally or in Vercel Environment Variables for production."
    );
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Create or reuse pg Pool - optimized for serverless
  const pool = globalForPrisma.pool ?? new pg.Pool({
    connectionString,
    // Serverless-optimized settings
    max: isProduction ? 5 : 10, // Fewer connections in production serverless
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Cache the pool
  if (!globalForPrisma.pool) {
    globalForPrisma.pool = pool;
  }

  // Create Prisma adapter with the pg pool
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: isProduction
      ? ["error", "warn"]
      : ["query", "info", "warn", "error"],
  });
}

// Always use cached client if available (critical for serverless!)
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Cache the client globally (for both dev and production on Vercel)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
