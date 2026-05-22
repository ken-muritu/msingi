import {
  Controller,
  Post,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { StorageService } from './storage.service';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a file (product image, KYC document, etc.)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) throw new Error('No file uploaded');
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new Error(`File type not allowed: ${file.mimetype}`);
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('File too large (max 5 MB)');
    }

    return this.storageService.upload({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: folder || 'products',
    });
  }

  @Post('presign')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a presigned URL for direct client-side upload' })
  getPresignedUrl(
    @Body() body: { key: string; mimeType: string; expiresIn?: number },
  ) {
    return this.storageService.getPresignedUploadUrl({
      key: body.key,
      mimeType: body.mimeType,
      expiresInSeconds: body.expiresIn,
    });
  }

  @Delete(':key')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a stored file by key' })
  deleteFile(@Param('key') key: string) {
    return this.storageService.delete(decodeURIComponent(key));
  }
}
