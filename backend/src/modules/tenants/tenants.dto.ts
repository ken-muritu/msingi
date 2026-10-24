import { IsString, IsOptional, IsEnum, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'TechShop Kenya' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @ApiProperty({ example: 'techshop', description: 'URL-safe slug, becomes PG schema name' })
  @IsString()
  @Matches(/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens, 3–50 chars',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'techshop.co.ke' })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ example: 'techshop' })
  @IsOptional()
  @IsString()
  subdomain?: string;

  @ApiPropertyOptional({ enum: ['starter', 'growth', 'enterprise'], default: 'starter' })
  @IsOptional()
  @IsEnum(['starter', 'growth', 'enterprise'])
  plan?: string;
}

export class UpdateTenantDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({ enum: ['starter', 'growth', 'enterprise'] })
  @IsOptional()
  @IsEnum(['starter', 'growth', 'enterprise'])
  plan?: string;

  @ApiPropertyOptional({ enum: ['active', 'suspended'] })
  @IsOptional()
  @IsEnum(['active', 'suspended'])
  status?: string;
}
