import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Load Next.js env files so the CLI picks up .env.local
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
