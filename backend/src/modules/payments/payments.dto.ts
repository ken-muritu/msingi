import { IsString, IsNumber, IsPositive, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StkPushDto {
  @ApiProperty({ example: 'ord_abc123' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: '0712345678', description: 'Kenyan phone number' })
  @IsString()
  @Matches(/^(\+?254|0)[17]\d{8}$/, { message: 'Invalid Kenyan phone number' })
  phone: string;
}

export class RefundDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
