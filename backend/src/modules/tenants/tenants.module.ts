import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { TenantPrismaService } from './tenant-prisma.service';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService, TenantPrismaService],
  exports: [TenantsService, TenantPrismaService],
})
export class TenantsModule {}
