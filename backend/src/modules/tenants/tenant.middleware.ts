import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantsService } from './tenants.service';

/**
 * Resolves the current tenant from the incoming request and attaches it to
 * `req.tenant`.  Resolution order:
 *   1. `X-Tenant-Slug` header (explicit, useful for API clients / mobile)
 *   2. `Host` header — matched against tenant.domain (exact) then tenant.subdomain
 *
 * If no tenant is resolved, `req.tenant` stays null — endpoints that require a
 * tenant context should check for it explicitly.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private readonly tenantsService: TenantsService) {}

  async use(req: Request & { tenant?: any }, _res: Response, next: NextFunction) {
    try {
      const slugHeader = req.headers['x-tenant-slug'] as string | undefined;

      if (slugHeader) {
        const tenant = await this.tenantsService.resolveFromSlug(slugHeader);
        if (tenant && tenant.status === 'active') {
          req.tenant = tenant;
        }
      } else {
        const host = req.headers.host || '';
        if (host) {
          const tenant = await this.tenantsService.resolveFromHost(host);
          if (tenant && tenant.status === 'active') {
            req.tenant = tenant;
          }
        }
      }
    } catch (err) {
      this.logger.error(`Tenant resolution failed: ${err}`);
    }

    next();
  }
}
