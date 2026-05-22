import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client | null;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;
  private readonly useLocal: boolean;

  constructor() {
    this.bucket = process.env.R2_BUCKET_NAME || 'msingi-assets';
    this.useLocal = process.env.STORAGE_PROVIDER !== 'r2';

    if (!this.useLocal && process.env.R2_ACCOUNT_ID) {
      this.s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
      });
      this.publicBaseUrl =
        process.env.R2_PUBLIC_URL ||
        `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${this.bucket}`;
    } else {
      this.s3 = null;
      this.publicBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    }
  }

  // ─── Upload file buffer ───────────────────────────────────────────────────

  async upload(params: {
    buffer: Buffer;
    originalName: string;
    mimeType: string;
    folder?: string;
  }): Promise<{ url: string; key: string }> {
    const ext = path.extname(params.originalName).toLowerCase() || '.bin';
    const folder = params.folder || 'uploads';
    const key = `${folder}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;

    if (!this.s3 || this.useLocal) {
      this.logger.warn('R2 not configured — returning placeholder URL');
      return {
        url: `${this.publicBaseUrl}/static/${key}`,
        key,
      };
    }

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: params.buffer,
        ContentType: params.mimeType,
        CacheControl: 'public, max-age=31536000',
      }),
    );

    const url = `${this.publicBaseUrl}/${key}`;
    this.logger.log(`Uploaded: ${key} → ${url}`);
    return { url, key };
  }

  // ─── Generate presigned upload URL (client-side direct upload) ───────────

  async getPresignedUploadUrl(params: {
    key: string;
    mimeType: string;
    expiresInSeconds?: number;
  }): Promise<string> {
    if (!this.s3) throw new BadRequestException('Storage not configured');

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.key,
      ContentType: params.mimeType,
    });

    return getSignedUrl(this.s3, cmd, { expiresIn: params.expiresInSeconds || 300 });
  }

  // ─── Delete file ──────────────────────────────────────────────────────────

  async delete(key: string): Promise<void> {
    if (!this.s3) return;
    await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    this.logger.log(`Deleted: ${key}`);
  }

  // ─── Extract key from URL ─────────────────────────────────────────────────

  extractKey(url: string): string {
    return url.replace(`${this.publicBaseUrl}/`, '');
  }
}
