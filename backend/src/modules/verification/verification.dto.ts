import { IsString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class KycDocumentDto {
  @ApiProperty({ example: 'kyc/123-national-id.pdf' })
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ example: 'national_id', enum: ['national_id', 'kra_pin', 'cr12', 'bank_letter', 'director_id', 'bof'] })
  @IsString()
  type: string;
}

export class SubmitVerificationDto {
  @ApiProperty({ enum: ['verified', 'premium', 'authorized'], default: 'verified' })
  @IsEnum(['verified', 'premium', 'authorized'])
  tier: string;

  @ApiProperty({ type: [KycDocumentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KycDocumentDto)
  documents: KycDocumentDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ReviewVerificationDto {
  @ApiProperty({ enum: ['approved', 'rejected', 'under_review'] })
  @IsEnum(['approved', 'rejected', 'under_review'])
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reviewNote?: string;
}
