import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsEnum,
  IsObject,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ShippingAddressDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  county: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryInstructions?: string;
}

export class CreateOrderDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @ApiProperty({ enum: ['mpesa', 'card', 'cash_on_delivery', 'bnpl'] })
  @IsEnum(['mpesa', 'card', 'cash_on_delivery', 'bnpl'])
  paymentMethod: 'mpesa' | 'card' | 'cash_on_delivery' | 'bnpl';
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'] })
  @IsEnum(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'])
  status: string;
}
