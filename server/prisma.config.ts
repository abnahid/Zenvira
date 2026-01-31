import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load .env in development
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is required for Prisma migrations. " +
    "Set it in your .env file locally or ensure it's available in your environment."
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    provider: "postgresql",
    url: connectionString,
  },
});
