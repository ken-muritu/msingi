import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('catalog')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // ─── Products ───────────────────────────────────────────────────────────────

  @Get('products')
  @ApiOperation({ summary: 'List products with filters & pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'brand', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'isFlashSale', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['newest', 'price_asc', 'price_desc', 'rating', 'popular'] })
  @ApiQuery({ name: 'search', required: false })
  getProducts(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('categoryId') categoryId?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('inStock') inStock?: boolean,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('isFlashSale') isFlashSale?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('search') search?: string,
  ) {
    return this.catalogService.getProducts({
      page, pageSize, categoryId, brand, minPrice, maxPrice,
      inStock, isFeatured, isFlashSale, sortBy, search,
    });
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  getProductById(@Param('id') id: string) {
    return this.catalogService.getProductById(id);
  }

  @Get('products/slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  getProductBySlug(@Param('slug') slug: string) {
    return this.catalogService.getProductBySlug(slug);
  }

  // ─── Categories ─────────────────────────────────────────────────────────────

  @Get('categories')
  @ApiOperation({ summary: 'List all categories' })
  getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  getCategoryBySlug(@Param('slug') slug: string) {
    return this.catalogService.getCategoryBySlug(slug);
  }

  // ─── Brands ─────────────────────────────────────────────────────────────────

  @Get('brands')
  @ApiOperation({ summary: 'List brands (optionally filtered by category)' })
  @ApiQuery({ name: 'categoryId', required: false })
  getBrands(@Query('categoryId') categoryId?: string) {
    return this.catalogService.getBrands(categoryId);
  }
}
