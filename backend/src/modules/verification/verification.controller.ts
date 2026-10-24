import {
  Controller, Post, Get, Patch, Param, Body, Request, Query,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiBearerAuth, ApiQuery,
} from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { SubmitVerificationDto, ReviewVerificationDto } from './verification.dto';

@ApiTags('verification')
@ApiBearerAuth()
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // ─── Seller endpoints ─────────────────────────────────────────────────────

  @Post('upload-url')
  @ApiOperation({ summary: 'Get a presigned R2 URL to upload a KYC document' })
  getUploadUrl(
    @Request() req: any,
    @Body() body: { docType: string; mimeType: string },
  ) {
    return this.verificationService.getUploadUrl(req.user.sellerId, body.docType, body.mimeType);
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit a KYC verification request' })
  submit(@Request() req: any, @Body() dto: SubmitVerificationDto) {
    return this.verificationService.submit(req.user.sellerId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my own verification requests' })
  getMy(@Request() req: any) {
    return this.verificationService.getMy(req.user.sellerId);
  }

  // ─── Admin endpoints ──────────────────────────────────────────────────────

  @Get('admin/requests')
  @ApiOperation({ summary: 'Admin: list verification requests' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  listPending(
    @Query('page') page?: number,
    @Query('status') status?: string,
  ) {
    return this.verificationService.listPending(page, status);
  }

  @Get('admin/requests/:id')
  @ApiOperation({ summary: 'Admin: get single verification request' })
  getById(@Param('id') id: string) {
    return this.verificationService.getById(id);
  }

  @Patch('admin/requests/:id/review')
  @ApiOperation({ summary: 'Admin: approve or reject a verification request' })
  review(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ReviewVerificationDto,
  ) {
    return this.verificationService.review(id, req.user.id, dto);
  }
}
