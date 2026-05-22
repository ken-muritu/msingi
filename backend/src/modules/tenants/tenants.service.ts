import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './tenants.dto';

const RESERVED_SLUGS = new Set([
  'admin', 'api', 'app', 'auth', 'billing', 'cdn', 'console', 'dashboard',
  'docs', 'health', 'help', 'mail', 'msingi', 'public', 'status', 'support',
  'www', 'staging', 'dev', 'test', 'sandbox',
]);

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Create tenant + provision PostgreSQL schema ──────────────────────────

  async create(ownerId: string, dto: CreateTenantDto) {
    if (RESERVED_SLUGS.has(dto.slug)) {
      throw new BadRequestException(`Slug "${dto.slug}" is reserved`);
    }

    const schemaName = `tenant_${dto.slug.replace(/-/g, '_')}`;

    const existing = await this.prisma.tenant.findFirst({
      where: { OR: [{ slug: dto.slug }, { schemaName }] },
    });
    if (existing) throw new ConflictException(`Tenant slug "${dto.slug}" is already taken`);

    if (dto.domain) {
      const domainTaken = await this.prisma.tenant.findUnique({ where: { domain: dto.domain } });
      if (domainTaken) throw new ConflictException(`Domain "${dto.domain}" is already registered`);
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        domain: dto.domain,
        subdomain: dto.subdomain ?? dto.slug,
        plan: dto.plan ?? 'starter',
        status: 'provisioning',
        schemaName,
        ownerId,
      },
    });

    // Provision the PostgreSQL schema asynchronously
    this.provisionSchema(tenant.id, schemaName).catch((err) => {
      this.logger.error(`Schema provisioning failed for ${schemaName}: ${err}`);
    });

    return tenant;
  }

  // ─── Provision schema: CREATE SCHEMA + clone tables ──────────────────────

  private async provisionSchema(tenantId: string, schemaName: string) {
    this.logger.log(`Provisioning schema: ${schemaName}`);

    try {
      // 1. Create the schema
      await this.prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

      // 2. Copy table structures from public schema (no data)
      //    We enumerate the key commerce tables and recreate them in the tenant schema.
      //    In production you would run the full Prisma migration SQL here instead.
      await this.prisma.$executeRawUnsafe(`
        DO $$
        DECLARE
          tbl TEXT;
          tables TEXT[] := ARRAY[
            'User','Seller','Category','Product','ProductImage','ProductVariant',
            'InventoryLog','Order','OrderItem','Transaction','Review',
            'Cart','CartItem','Notification','VerificationRequest'
          ];
        BEGIN
          FOREACH tbl IN ARRAY tables LOOP
            BEGIN
              EXECUTE format(
                'CREATE TABLE IF NOT EXISTS %I.%I (LIKE public.%I INCLUDING ALL)',
                '${schemaName}', tbl, tbl
              );
            EXCEPTION WHEN others THEN
              RAISE WARNING 'Could not clone table %: %', tbl, SQLERRM;
            END;
          END LOOP;
        END;
        $$
      `);

      // 3. Mark tenant as active
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { status: 'active' },
      });

      this.logger.log(`Schema ${schemaName} provisioned successfully`);
    } catch (err) {
      this.logger.error(`Failed to provision schema ${schemaName}: ${err}`);
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { status: 'provisioning' }, // stays provisioning — admin must retry
      }).catch(() => null);
      throw err;
    }
  }

  // ─── Resolve tenant from domain / subdomain ───────────────────────────────

  async resolveFromHost(host: string): Promise<{ id: string; slug: string; schemaName: string; domain: string | null; subdomain: string | null; plan: string; status: string } | null> {
    // Strip port
    const hostWithoutPort = host.split(':')[0];

    // Try exact domain match first
    const byDomain = await this.prisma.tenant.findUnique({
      where: { domain: hostWithoutPort },
      select: { id: true, slug: true, schemaName: true, domain: true, subdomain: true, plan: true, status: true },
    });
    if (byDomain) return byDomain;

    // Try subdomain: extract first segment e.g. "techshop" from "techshop.msingi.co.ke"
    const parts = hostWithoutPort.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      const bySubdomain = await this.prisma.tenant.findUnique({
        where: { subdomain },
        select: { id: true, slug: true, schemaName: true, domain: true, subdomain: true, plan: true, status: true },
      });
      if (bySubdomain) return bySubdomain;
    }

    return null;
  }

  async resolveFromSlug(slug: string) {
    return this.prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, slug: true, schemaName: true, domain: true, subdomain: true, plan: true, status: true },
    });
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  async findAll(page = 1, pageSize = 20) {
    const [data, total] = await this.prisma.$transaction([
      this.prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: { id: true, name: true, slug: true, subdomain: true, domain: true, plan: true, status: true, schemaName: true, createdAt: true },
      }),
      this.prisma.tenant.count(),
    ]);
    return { data, total, page, pageSize };
  }

  async findOne(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: { owner: { select: { id: true, name: true, email: true } } },
    });
    if (!tenant) throw new NotFoundException(`Tenant "${slug}" not found`);
    return tenant;
  }

  async update(slug: string, dto: UpdateTenantDto) {
    await this.findOne(slug);
    return this.prisma.tenant.update({ where: { slug }, data: dto });
  }

  async reprovision(slug: string) {
    const tenant = await this.findOne(slug);
    await this.prisma.tenant.update({ where: { slug }, data: { status: 'provisioning' } });
    await this.provisionSchema(tenant.id, tenant.schemaName);
    return this.findOne(slug);
  }
}
