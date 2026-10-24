import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { MeiliSearch } = require('meilisearch');

const PRODUCTS_INDEX = 'products';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private meili: any = null;
  private meiliReady = false;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.MEILISEARCH_HOST) {
      this.meili = new MeiliSearch({
        host: process.env.MEILISEARCH_HOST,
        apiKey: process.env.MEILISEARCH_API_KEY || '',
      });
    }
  }

  async onModuleInit() {
    if (!this.meili) return;
    try {
      await this.meili.index(PRODUCTS_INDEX).updateSettings({
        searchableAttributes: ['name', 'brand', 'description', 'tags', 'categoryName'],
        filterableAttributes: ['brand', 'categoryId', 'status', 'price', 'stockCount', 'isFlashSale', 'isFeatured'],
        sortableAttributes: ['price', 'rating', 'salesCount', 'createdAt'],
        rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
      });
      this.meiliReady = true;
      this.logger.log('MeiliSearch index configured');
    } catch (err) {
      this.logger.warn(`MeiliSearch not available, falling back to DB: ${err}`);
    }
  }

  // ─── Index a product (called on create/update) ────────────────────────────

  async indexProduct(productId: string) {
    if (!this.meili || !this.meiliReady) return;
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    });
    if (!product) return;

    await this.meili.index(PRODUCTS_INDEX).addDocuments([{
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      description: product.description,
      tags: product.tags,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      rating: product.rating,
      salesCount: product.salesCount,
      stockCount: product.stockCount,
      status: product.status,
      isFeatured: product.isFeatured,
      isFlashSale: product.isFlashSale,
      image: product.images?.[0]?.url || '',
      createdAt: product.createdAt.toISOString(),
    }]);
  }

  async removeFromIndex(productId: string) {
    if (!this.meili || !this.meiliReady) return;
    await this.meili.index(PRODUCTS_INDEX).deleteDocument(productId);
  }

  async reindexAll() {
    if (!this.meili || !this.meiliReady) return { skipped: true };
    const products = await this.prisma.product.findMany({
      where: { status: 'active' },
      include: {
        category: { select: { name: true, slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    });

    const docs = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      description: p.description,
      tags: p.tags,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      rating: p.rating,
      salesCount: p.salesCount,
      stockCount: p.stockCount,
      status: p.status,
      isFeatured: p.isFeatured,
      isFlashSale: p.isFlashSale,
      image: p.images?.[0]?.url || '',
      createdAt: p.createdAt.toISOString(),
    }));

    const task = await this.meili.index(PRODUCTS_INDEX).addDocuments(docs);
    this.logger.log(`Reindex queued: taskUid=${task.taskUid}, ${docs.length} products`);
    return { taskUid: task.taskUid, count: docs.length };
  }

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
      minPrice: rawMinPrice,
      maxPrice: rawMaxPrice,
      inStock,
      sortBy = 'relevance',
      page: rawPage = 1,
      pageSize: rawPageSize = 20,
    } = filters || {};

    const page = Number(rawPage) || 1;
    const pageSize = Number(rawPageSize) || 20;
    const minPrice = rawMinPrice !== undefined ? Number(rawMinPrice) : undefined;
    const maxPrice = rawMaxPrice !== undefined ? Number(rawMaxPrice) : undefined;

    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined && !isNaN(minPrice)) priceFilter.gte = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice)) priceFilter.lte = maxPrice;

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
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
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
      brands: brands.map((b: any) => ({ name: b.brand, count: b._count })),
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
