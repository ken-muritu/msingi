import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface TenantContext {
  id: string;
  slug: string;
  schemaName: string;
  domain: string | null;
  subdomain: string | null;
  plan: string;
  status: string;
}

export const CurrentTenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TenantContext | null => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenant ?? null;
  },
);
