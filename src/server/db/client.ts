import "server-only";
import { createDatabase, type Database } from "./create";
import { getEnv } from "../env";

let pending: Promise<Database> | undefined;

/** Lazily creates one shared database connection per server process. */
export function getDb(): Promise<Database> {
  pending ??= (async () => {
    const env = getEnv();
    const { db } = await createDatabase(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN);
    return db;
  })();
  return pending;
}
