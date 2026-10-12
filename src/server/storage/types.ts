/**
 * Provider-neutral private object storage contract. Business logic depends only
 * on this interface so providers can be swapped without rewriting services.
 */
export interface PresignedUpload {
  url: string;
  method: "PUT";
  /** Headers the browser must send unchanged for the signature to match. */
  headers: Record<string, string>;
  expiresAt: Date;
}

export interface PresignedDownload {
  url: string;
  expiresAt: Date;
}

export interface ObjectHead {
  sizeBytes: number;
  contentType: string | undefined;
  /** Hex or base64 checksum when the provider reports one. */
  checksum: string | undefined;
}

export interface StorageAdapter {
  createUploadUrl(input: { key: string; contentType: string; sizeBytes: number; expiresInSeconds: number }): Promise<PresignedUpload>;
  createDownloadUrl(input: { key: string; filename: string; expiresInSeconds: number }): Promise<PresignedDownload>;
  /** Returns null when the object does not exist. */
  headObject(key: string): Promise<ObjectHead | null>;
  /** Reads the first bytes of an object for file-signature verification. */
  readRange(key: string, start: number, endInclusive: number): Promise<Uint8Array>;
  deleteObject(key: string): Promise<void>;
}
