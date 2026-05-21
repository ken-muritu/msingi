import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'brand', required: false, isArray: true })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['relevance', 'price_asc', 'price_desc', 'rating', 'popular', 'newest'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  search(
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string[],
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('inStock') inStock?: boolean,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: number,
  ) {
    return this.searchService.search(q, {
      category, brand, minPrice, maxPrice, inStock, sortBy, page,
    });
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete search suggestions' })
  @ApiQuery({ name: 'q', required: true })
  autocomplete(@Query('q') q: string) {
    return this.searchService.autocomplete(q);
  }
}
