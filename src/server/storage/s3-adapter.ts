import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { ObjectHead, PresignedDownload, PresignedUpload, StorageAdapter } from "./types";

export interface S3AdapterConfig {
  endpoint?: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

function safeAttachmentName(filename: string): string {
  const ascii = filename.replace(/[^\x20-\x7E]/g, "_").replace(/["\\\r\n]/g, "_");
  return ascii.slice(0, 200) || "download";
}

/** Works with Cloudflare R2 and other S3-compatible private buckets. */
export class S3StorageAdapter implements StorageAdapter {
  private readonly client: S3Client;

  constructor(private readonly config: S3AdapterConfig) {
    this.client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: Boolean(config.endpoint),
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }

  async createUploadUrl(input: { key: string; contentType: string; sizeBytes: number; expiresInSeconds: number }): Promise<PresignedUpload> {
    const command = new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: input.key,
      ContentType: input.contentType,
      ContentLength: input.sizeBytes,
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: input.expiresInSeconds });
    return {
      url,
      method: "PUT",
      headers: { "Content-Type": input.contentType },
      expiresAt: new Date(Date.now() + input.expiresInSeconds * 1000),
    };
  }

  async createDownloadUrl(input: { key: string; filename: string; expiresInSeconds: number }): Promise<PresignedDownload> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: input.key,
      ResponseContentDisposition: `attachment; filename="${safeAttachmentName(input.filename)}"`,
      ResponseContentType: "application/octet-stream",
    });
    const url = await getSignedUrl(this.client, command, { expiresIn: input.expiresInSeconds });
    return { url, expiresAt: new Date(Date.now() + input.expiresInSeconds * 1000) };
  }

  async headObject(key: string): Promise<ObjectHead | null> {
    try {
      const result = await this.client.send(new HeadObjectCommand({ Bucket: this.config.bucket, Key: key }));
      return {
        sizeBytes: result.ContentLength ?? 0,
        contentType: result.ContentType,
        checksum: result.ChecksumSHA256 ?? result.ETag?.replaceAll('"', ""),
      };
    } catch (error) {
      if (typeof error === "object" && error !== null && "name" in error && (error.name === "NotFound" || error.name === "NoSuchKey")) return null;
      throw error;
    }
  }

  async readRange(key: string, start: number, endInclusive: number): Promise<Uint8Array> {
    const result = await this.client.send(new GetObjectCommand({ Bucket: this.config.bucket, Key: key, Range: `bytes=${start}-${endInclusive}` }));
    if (!result.Body) return new Uint8Array();
    return result.Body.transformToByteArray();
  }

  async deleteObject(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: key }));
  }
}
