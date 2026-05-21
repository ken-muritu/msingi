import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(data: {
    productId: string;
    userId: string;
    orderId?: string;
    rating: number;
    title: string;
    body: string;
    images?: string[];
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if user already reviewed this product
    const existing = await this.prisma.review.findFirst({
      where: { productId: data.productId, userId: data.userId },
    });
    if (existing) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Check if verified purchase
    let isVerifiedPurchase = false;
    if (data.orderId) {
      const orderItem = await this.prisma.orderItem.findFirst({
        where: {
          order: { id: data.orderId, userId: data.userId, status: 'delivered' },
          productId: data.productId,
        },
      });
      isVerifiedPurchase = !!orderItem;
    }

    const review = await this.prisma.review.create({
      data: {
        productId: data.productId,
        userId: data.userId,
        orderId: data.orderId,
        rating: data.rating,
        title: data.title,
        body: data.body,
        images: data.images || [],
        isVerifiedPurchase,
        status: 'approved', // Auto-approve for now; can add moderation later
      },
    });

    // Update product aggregate rating
    await this.updateProductRating(data.productId);

    return review;
  }

  async getProductReviews(productId: string, page = 1, pageSize = 20) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId, status: 'approved' },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { name: true, avatar: true } } },
      }),
      this.prisma.review.count({ where: { productId, status: 'approved' } }),
    ]);

    // Rating distribution
    const distribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { productId, status: 'approved' },
      _count: true,
    });

    return {
      data: reviews,
      total,
      page,
      pageSize,
      ratingDistribution: distribution,
    };
  }

  async markHelpful(reviewId: string) {
    return this.prisma.review.update({
      where: { id: reviewId },
      data: { helpfulCount: { increment: 1 } },
    });
  }

  async addSellerResponse(reviewId: string, sellerId: string, response: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: { select: { sellerId: true } } },
    });

    if (!review) throw new NotFoundException('Review not found');
    if (review.product.sellerId !== sellerId) {
      throw new BadRequestException('Only the product seller can respond');
    }

    return this.prisma.review.update({
      where: { id: reviewId },
      data: { sellerResponse: response, sellerResponseAt: new Date() },
    });
  }

  private async updateProductRating(productId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { productId, status: 'approved' },
      _avg: { rating: true },
      _count: true,
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregate._avg.rating || 0,
        reviewCount: aggregate._count,
      },
    });
  }
}
