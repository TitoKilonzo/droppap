import { migrate } from "drizzle-orm/libsql/migrator";
import { fileURLToPath } from "node:url";
import { createDatabase } from "./create";

/**
 * Applies pending migrations. Run explicitly (npm run db:migrate); the application
 * never migrates on startup.
 */
async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required to run migrations");
  const { db, client } = await createDatabase(url, process.env.DATABASE_AUTH_TOKEN);
  try {
    await migrate(db, { migrationsFolder: fileURLToPath(new URL("./migrations", import.meta.url)) });
    console.log("Migrations applied.");
  } finally {
    client.close();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
