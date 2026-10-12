import { randomUUID } from "node:crypto";

/**
 * Object keys are generated entirely by the server. The untrusted filename is never
 * part of the key; it is stored as metadata and applied via Content-Disposition.
 * Layout: orgs/<organizationId>/files/<fileId>/<versionId>/<random>
 */
export function buildObjectKey(input: { organizationId: string; fileId: string; versionId: string }): string {
  for (const [name, value] of Object.entries(input)) {
    if (!/^[A-Za-z0-9-]{8,64}$/.test(value)) throw new Error(`Invalid ${name} for object key`);
  }
  return `orgs/${input.organizationId}/files/${input.fileId}/${input.versionId}/${randomUUID()}`;
}

/** Ensures a key belongs to the given organization before any storage operation. */
export function assertKeyInOrganization(key: string, organizationId: string): void {
  if (!key.startsWith(`orgs/${organizationId}/`) || key.includes("..")) {
    throw new Error("Object key does not belong to the organization");
  }
}
