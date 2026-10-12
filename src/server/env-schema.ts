import { z } from "zod";

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value && value.trim() !== "" ? value.trim() : undefined));

const baseSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.url(),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  DATABASE_URL: z.string().min(1),
  DATABASE_AUTH_TOKEN: optionalString,
  STORAGE_ENDPOINT: optionalString,
  STORAGE_REGION: optionalString,
  STORAGE_BUCKET: optionalString,
  STORAGE_ACCESS_KEY_ID: optionalString,
  STORAGE_SECRET_ACCESS_KEY: optionalString,
  STORAGE_PUBLIC_BASE_URL: optionalString,
  EMAIL_PROVIDER_API_KEY: optionalString,
  EMAIL_FROM: optionalString,
  RATE_LIMIT_PROVIDER_URL: optionalString,
  RATE_LIMIT_PROVIDER_TOKEN: optionalString,
  MALWARE_SCAN_PROVIDER_URL: optionalString,
  MALWARE_SCAN_PROVIDER_TOKEN: optionalString,
  ALLOW_DEV_WORKSPACE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export const envSchema = baseSchema.superRefine((env, ctx) => {
  const fail = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });

  if (env.DATABASE_URL.startsWith("libsql://") && !env.DATABASE_AUTH_TOKEN) {
    fail("DATABASE_AUTH_TOKEN", "Required for remote libSQL/Turso databases");
  }

  if (env.NODE_ENV === "production") {
    if (!env.APP_URL.startsWith("https://")) fail("APP_URL", "Must use https in production");
    if (env.DATABASE_URL.startsWith("file:")) fail("DATABASE_URL", "A local file database is not allowed in production");
    if (env.ALLOW_DEV_WORKSPACE) fail("ALLOW_DEV_WORKSPACE", "Must be false in production");
    for (const key of ["STORAGE_ENDPOINT", "STORAGE_BUCKET", "STORAGE_ACCESS_KEY_ID", "STORAGE_SECRET_ACCESS_KEY"] as const) {
      if (!env[key]) fail(key, "Required in production");
    }
  }
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const summary = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid environment configuration: ${summary}`);
  }
  return parsed.data;
}
