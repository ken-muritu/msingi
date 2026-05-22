import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddCartItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  quantity: number;
}

export class MergeCartDto {
  @ApiProperty()
  @IsString()
  sessionId: string;
}
