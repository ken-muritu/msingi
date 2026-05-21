import { IsEmail, IsOptional, IsString, MinLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Kamau' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+254712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ enum: ['buyer', 'seller'], default: 'buyer' })
  @IsOptional()
  @IsIn(['buyer', 'seller'])
  role?: 'buyer' | 'seller';
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'Email or phone number' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}
