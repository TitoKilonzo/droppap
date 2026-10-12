import "server-only";
import { parseEnv, type Env } from "./env-schema";

let cached: Env | undefined;

/** Validated server environment. Throws a descriptive error if configuration is invalid. */
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
