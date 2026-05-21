import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  // In production: MeiliSearch integration
  // For now: database-backed search with full-text capabilities

  async search(query: string, filters?: {
    category?: string;
    brand?: string[];
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
    page?: number;
    pageSize?: number;
  }) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'relevance',
      page = 1,
      pageSize = 20,
    } = filters || {};

    const where: any = {
      status: 'active',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: query.toLowerCase().split(' ') } },
      ],
      ...(category && { category: { slug: category } }),
      ...(brand?.length && { brand: { in: brand } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(inStock && { stockCount: { gt: 0 } }),
    };

    const orderBy = this.getOrderBy(sortBy);

    const startTime = Date.now();

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: { select: { name: true, slug: true } },
          seller: { select: { id: true, businessName: true, badge: true, rating: true } },
          images: { where: { isPrimary: true }, take: 1 },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const processingTimeMs = Date.now() - startTime;

    // Build facets
    const facetData = await this.buildFacets(query);

    return {
      products,
      totalCount: total,
      facets: facetData,
      query,
      processingTimeMs,
      page,
      pageSize,
    };
  }

  async autocomplete(query: string, limit = 8) {
    const products = await this.prisma.product.findMany({
      where: {
        status: 'active',
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        brand: true,
        price: true,
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
      },
      take: limit,
    });

    return { suggestions: products, query };
  }

  private async buildFacets(query: string) {
    const baseWhere: any = {
      status: 'active',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [categories, brands, priceRange] = await Promise.all([
      this.prisma.product.groupBy({
        by: ['categoryId'],
        where: baseWhere,
        _count: true,
      }),
      this.prisma.product.groupBy({
        by: ['brand'],
        where: baseWhere,
        _count: true,
      }),
      this.prisma.product.aggregate({
        where: baseWhere,
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return {
      categories,
      brands: brands.map((b) => ({ name: b.brand, count: b._count })),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 0,
      },
    };
  }

  private getOrderBy(sortBy: string): any {
    switch (sortBy) {
      case 'price_asc': return { price: 'asc' };
      case 'price_desc': return { price: 'desc' };
      case 'rating': return { rating: 'desc' };
      case 'popular': return { salesCount: 'desc' };
      case 'newest': return { createdAt: 'desc' };
      case 'relevance':
      default: return { rating: 'desc' };
    }
  }
}
