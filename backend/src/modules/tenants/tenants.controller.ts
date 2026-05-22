import {
  Controller, Get, Post, Patch, Param, Body, Request, Query,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiQuery,
} from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto } from './tenants.dto';
import { CurrentTenant, TenantContext } from './tenant.decorator';
import { Public } from '../auth/public.decorator';

@ApiTags('tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // ─── Owner / Admin ────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Create a new tenant and provision its PostgreSQL schema' })
  create(@Request() req: any, @Body() dto: CreateTenantDto) {
    return this.tenantsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tenants (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  findAll(@Query('page') page?: number) {
    return this.tenantsService.findAll(page);
  }

  @Get('context')
  @ApiOperation({ summary: 'Return resolved tenant for the current request' })
  getContext(@CurrentTenant() tenant: TenantContext | null) {
    return tenant ?? { message: 'No tenant resolved for this request' };
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get tenant by slug' })
  findOne(@Param('slug') slug: string) {
    return this.tenantsService.findOne(slug);
  }

  @Patch(':slug')
  @ApiOperation({ summary: 'Update tenant name, domain, plan, or status' })
  update(@Param('slug') slug: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(slug, dto);
  }

  @Post(':slug/reprovision')
  @ApiOperation({ summary: 'Re-run schema provisioning for a tenant (admin recovery)' })
  reprovision(@Param('slug') slug: string) {
    return this.tenantsService.reprovision(slug);
  }
}
