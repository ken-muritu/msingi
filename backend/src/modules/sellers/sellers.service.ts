import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SellersService {
  constructor(private readonly prisma: PrismaService) {}

  async registerSeller(userId: string, data: {
    businessName: string;
    description: string;
    location: string;
    county: string;
  }) {
    const existingSeller = await this.prisma.seller.findUnique({ where: { userId } });
    if (existingSeller) throw new BadRequestException('User is already a seller');

    const slug = data.businessName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    return this.prisma.seller.create({
      data: {
        userId,
        businessName: data.businessName,
        slug,
        description: data.description,
        location: data.location,
        county: data.county,
        badge: 'basic',
        status: 'pending',
        commissionRate: 8.5,
      },
    });
  }

  async getSeller(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
      include: {
        products: { where: { status: 'active' }, take: 20 },
        user: { select: { name: true, email: true, phone: true } },
      },
    });
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async getSellerBySlug(slug: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { slug },
      include: {
        products: { where: { status: 'active' }, take: 20 },
      },
    });
    if (!seller) throw new NotFoundException('Seller not found');
    return seller;
  }

  async listSellers(page = 1, pageSize = 20, status?: string) {
    const where = status ? { status } : {};
    const [sellers, total] = await Promise.all([
      this.prisma.seller.findMany({
        where,
        orderBy: { rating: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.seller.count({ where }),
    ]);
    return { data: sellers, total, page, pageSize };
  }

  async updateSellerStatus(id: string, status: string) {
    return this.prisma.seller.update({
      where: { id },
      data: { status, verified: status === 'active' },
    });
  }

  async getSellerDashboard(sellerId: string) {
    const [seller, productCount, orderItems, recentOrders] = await Promise.all([
      this.prisma.seller.findUnique({ where: { id: sellerId } }),
      this.prisma.product.count({ where: { sellerId, status: 'active' } }),
      this.prisma.orderItem.aggregate({
        where: { sellerId },
        _sum: { total: true },
        _count: true,
      }),
      this.prisma.orderItem.findMany({
        where: { sellerId },
        orderBy: { order: { createdAt: 'desc' } },
        take: 10,
        include: { order: { select: { orderNumber: true, status: true, createdAt: true } } },
      }),
    ]);

    return {
      seller,
      stats: {
        activeProducts: productCount,
        totalOrders: orderItems._count,
        totalRevenue: orderItems._sum.total || 0,
      },
      recentOrders,
    };
  }
}
