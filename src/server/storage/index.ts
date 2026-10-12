import "server-only";
import { AppError } from "@/lib/errors";
import { getEnv } from "../env";
import { S3StorageAdapter } from "./s3-adapter";
import type { StorageAdapter } from "./types";

let adapter: StorageAdapter | undefined;

/** Returns the configured private storage adapter, or fails safely when it is not configured. */
export function getStorage(): StorageAdapter {
  if (adapter) return adapter;
  const env = getEnv();
  if (!env.STORAGE_BUCKET || !env.STORAGE_ACCESS_KEY_ID || !env.STORAGE_SECRET_ACCESS_KEY) {
    throw new AppError("CONFIGURATION_ERROR", { message: "Object storage is not configured." });
  }
  adapter = new S3StorageAdapter({
    endpoint: env.STORAGE_ENDPOINT,
    region: env.STORAGE_REGION ?? "auto",
    bucket: env.STORAGE_BUCKET,
    accessKeyId: env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: env.STORAGE_SECRET_ACCESS_KEY,
  });
  return adapter;
}

export type { StorageAdapter } from "./types";
