import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./src/server/db/schema/index.ts",
  out: "./src/server/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./local.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
  strict: true,
  verbose: true,
});
