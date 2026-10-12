import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import * as schema from "./schema";

export type Database = LibSQLDatabase<typeof schema>;

export interface DatabaseHandle {
  db: Database;
  client: Client;
}

/**
 * Creates a Drizzle database over libSQL. Foreign keys are enabled explicitly
 * so local file databases behave like Turso, which enforces them by default.
 */
export async function createDatabase(url: string, authToken?: string): Promise<DatabaseHandle> {
  const client = createClient({ url, authToken });
  await client.execute("PRAGMA foreign_keys = ON");
  return { db: drizzle(client, { schema }), client };
}
