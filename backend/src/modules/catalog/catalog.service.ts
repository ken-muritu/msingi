import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Products ───────────────────────────────────────────────────────────────

  async getProducts(params: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    isFeatured?: boolean;
    isFlashSale?: boolean;
    sortBy?: string;
    search?: string;
  }) {
    const {
      page: rawPage = 1,
      pageSize: rawPageSize = 20,
      categoryId,
      brand,
      minPrice: rawMinPrice,
      maxPrice: rawMaxPrice,
      inStock,
      isFeatured,
      isFlashSale,
      sortBy = 'newest',
      search,
    } = params;

    const page = Number(rawPage) || 1;
    const pageSize = Number(rawPageSize) || 20;
    const minPrice = rawMinPrice !== undefined ? Number(rawMinPrice) : undefined;
    const maxPrice = rawMaxPrice !== undefined ? Number(rawMaxPrice) : undefined;

    const priceFilter: Record<string, number> = {};
    if (minPrice !== undefined && !isNaN(minPrice)) priceFilter.gte = minPrice;
    if (maxPrice !== undefined && !isNaN(maxPrice)) priceFilter.lte = maxPrice;

    const where: Prisma.ProductWhereInput = {
      status: 'active',
      ...(categoryId && { categoryId }),
      ...(brand && { brand }),
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
      ...(inStock !== undefined && { stockCount: inStock ? { gt: 0 } : { equals: 0 } }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(isFlashSale !== undefined && { isFlashSale }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          { brand: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
        ],
      }),
    };

    const orderBy = this.getProductOrderBy(sortBy);

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          category: true,
          seller: { select: { id: true, businessName: true, badge: true, rating: true, verified: true } },
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { where: { isActive: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNext: page * pageSize < total,
      hasPrevious: page > 1,
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        seller: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        reviews: {
          where: { status: 'approved' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        seller: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true } },
        reviews: {
          where: { status: 'approved' },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { name: true, avatar: true } } },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async createProduct(sellerId: string, data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data: { ...data, seller: { connect: { id: sellerId } } },
      include: { category: true, images: true, variants: true },
    });
  }

  async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
      include: { category: true, images: true, variants: true },
    });
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  async getCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: { where: { isActive: true } },
        products: { where: { status: 'active' }, take: 20 },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  // ─── Brands ─────────────────────────────────────────────────────────────────

  async getBrands(categoryId?: string) {
    const where: Prisma.ProductWhereInput = {
      status: 'active',
      ...(categoryId && { categoryId }),
    };

    const brands = await this.prisma.product.findMany({
      where,
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    });

    return brands.map((b) => b.brand).filter(Boolean);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private getProductOrderBy(sortBy: string): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case 'price_asc': return { price: 'asc' };
      case 'price_desc': return { price: 'desc' };
      case 'rating': return { rating: 'desc' };
      case 'popular': return { salesCount: 'desc' };
      case 'newest':
      default: return { createdAt: 'desc' };
    }
  }
}
