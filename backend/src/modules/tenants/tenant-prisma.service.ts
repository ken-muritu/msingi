import { Injectable, Scope } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Per-request Prisma client that sets `search_path` for a specific tenant schema.
 *
 * Usage: inject TenantPrismaService, call `forSchema(schemaName)` to get a
 * schema-scoped PrismaClient, then use it exactly like the regular PrismaService.
 *
 * The underlying PrismaClient uses a connection-level `SET search_path` so all
 * queries in that logical request go to the tenant's schema tables (which are
 * copies of the public schema structure, created during tenant provisioning).
 */
@Injectable({ scope: Scope.DEFAULT })
export class TenantPrismaService {
  private readonly clients = new Map<string, PrismaClient>();
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.DATABASE_URL || '';
  }

  /**
   * Returns a PrismaClient whose connection has `search_path` set to the given
   * schema name.  Clients are cached by schema name for connection pool reuse.
   */
  forSchema(schemaName: string): PrismaClient {
    if (this.clients.has(schemaName)) {
      return this.clients.get(schemaName)!;
    }

    const url = this.buildSchemaUrl(schemaName);
    const client = new PrismaClient({
      datasources: { db: { url } },
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });

    this.clients.set(schemaName, client);
    return client;
  }

  private buildSchemaUrl(schemaName: string): string {
    // Append ?schema=<schemaName> to the DATABASE_URL so Prisma sets search_path
    try {
      const url = new URL(this.baseUrl);
      url.searchParams.set('schema', schemaName);
      return url.toString();
    } catch {
      // Fallback: append directly
      const sep = this.baseUrl.includes('?') ? '&' : '?';
      return `${this.baseUrl}${sep}schema=${schemaName}`;
    }
  }

  async disconnectAll() {
    await Promise.all([...this.clients.values()].map((c) => c.$disconnect()));
    this.clients.clear();
  }
}
