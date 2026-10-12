import { integer, text } from "drizzle-orm/sqlite-core";

/** Server-generated opaque identifiers. */
export const newId = (): string => crypto.randomUUID();

export const id = () => text("id").primaryKey().$defaultFn(newId);

/** UTC instants stored as integer milliseconds since the Unix epoch. */
export const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });

export const createdAt = () => timestamp("created_at").notNull().$defaultFn(() => new Date());

export const updatedAt = () =>
  timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date());
