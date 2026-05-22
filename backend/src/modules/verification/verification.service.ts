import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SubmitVerificationDto, ReviewVerificationDto } from './verification.dto';

const REQUIRED_DOCS_BY_TIER: Record<string, string[]> = {
  verified:   ['national_id', 'kra_pin'],
  premium:    ['national_id', 'kra_pin', 'bank_letter'],
  authorized: ['national_id', 'kra_pin', 'cr12', 'bank_letter', 'director_id'],
};

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly notifications: NotificationsService,
  ) {}

  // ─── Get presigned upload URL for a KYC document ─────────────────────────

  async getUploadUrl(sellerId: string, docType: string, mimeType: string) {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(mimeType)) {
      throw new BadRequestException(`Unsupported file type: ${mimeType}. Allowed: PDF, JPEG, PNG, WEBP`);
    }

    const ext = mimeType === 'application/pdf' ? '.pdf'
      : mimeType === 'image/jpeg' ? '.jpg'
      : mimeType === 'image/png' ? '.png' : '.webp';

    const key = `kyc/${sellerId}/${docType}-${Date.now()}${ext}`;
    const url = await this.storage.getPresignedUploadUrl({ key, mimeType, expiresInSeconds: 600 }).catch(() => null);

    return { key, uploadUrl: url, expiresInSeconds: 600 };
  }

  // ─── Submit a verification request ───────────────────────────────────────

  async submit(sellerId: string, dto: SubmitVerificationDto) {
    const seller = await this.prisma.seller.findUnique({ where: { id: sellerId } });
    if (!seller) throw new NotFoundException('Seller not found');

    const required = REQUIRED_DOCS_BY_TIER[dto.tier] ?? [];
    const provided = dto.documents.map((d) => d.type);
    const missing = required.filter((r) => !provided.includes(r));
    if (missing.length) {
      throw new BadRequestException(`Missing required documents for ${dto.tier} tier: ${missing.join(', ')}`);
    }

    const pending = await this.prisma.verificationRequest.findFirst({
      where: { sellerId, status: { in: ['pending', 'under_review'] } },
    });
    if (pending) {
      throw new BadRequestException('You already have a pending verification request');
    }

    const request = await this.prisma.verificationRequest.create({
      data: {
        sellerId,
        tier: dto.tier,
        documents: dto.documents.map((d) => ({ ...d, uploadedAt: new Date().toISOString() })),
        notes: dto.notes,
        status: 'pending',
      },
    });

    this.logger.log(`KYC request ${request.id} submitted by seller ${sellerId} for ${dto.tier} tier`);
    return request;
  }

  // ─── Get seller's own verification requests ───────────────────────────────

  async getMy(sellerId: string) {
    return this.prisma.verificationRequest.findMany({
      where: { sellerId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  // ─── Admin: list all pending requests ────────────────────────────────────

  async listPending(page = 1, status?: string) {
    const pageSize = 20;
    const where = status ? { status } : { status: { in: ['pending', 'under_review'] } };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.verificationRequest.findMany({
        where,
        include: { seller: { select: { businessName: true, slug: true, userId: true } } },
        orderBy: { submittedAt: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.verificationRequest.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  // ─── Admin: approve or reject ─────────────────────────────────────────────

  async review(requestId: string, adminUserId: string, dto: ReviewVerificationDto) {
    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { seller: { include: { user: true } } },
    });
    if (!request) throw new NotFoundException('Verification request not found');

    if (request.status === 'approved') {
      throw new BadRequestException('Request is already approved');
    }

    const updated = await this.prisma.verificationRequest.update({
      where: { id: requestId },
      data: {
        status: dto.status,
        reviewNote: dto.reviewNote,
        reviewedBy: adminUserId,
        reviewedAt: new Date(),
      },
    });

    if (dto.status === 'approved') {
      const badgeMap: Record<string, string> = {
        verified: 'verified',
        premium: 'premium',
        authorized: 'authorized',
      };
      await this.prisma.seller.update({
        where: { id: request.sellerId },
        data: {
          verified: true,
          badge: badgeMap[request.tier] ?? 'verified',
          status: 'active',
        },
      });
      this.logger.log(`Seller ${request.sellerId} approved for ${request.tier} badge`);
    }

    const seller = request.seller;
    const phone = seller.user.phone;
    const email = seller.user.email;
    const msg = dto.status === 'approved'
      ? `Great news! Your ${request.tier} verification has been approved. Your badge is now active on Msingi.`
      : `Your verification request has been ${dto.status}. ${dto.reviewNote ? 'Note: ' + dto.reviewNote : 'Please resubmit with the correct documents.'}`;

    if (phone) {
      this.notifications.send({
        phone,
        channel: 'sms',
        type: 'promotional',
        body: msg,
      }).catch(() => null);
    }
    if (email) {
      this.notifications.send({
        email,
        channel: 'email',
        type: 'promotional',
        subject: `Verification ${dto.status === 'approved' ? 'Approved' : 'Update'} — Msingi`,
        body: `<p>${msg}</p>`,
      }).catch(() => null);
    }

    return updated;
  }

  // ─── Get single request ───────────────────────────────────────────────────

  async getById(requestId: string) {
    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { seller: { select: { businessName: true, slug: true } } },
    });
    if (!request) throw new NotFoundException('Verification request not found');
    return request;
  }
}
