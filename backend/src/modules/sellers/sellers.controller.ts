import { Controller, Get, Post, Put, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SellersService } from './sellers.service';

@ApiTags('sellers')
@Controller('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post('register')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register as a seller' })
  register(@Body() body: { userId: string; businessName: string; description: string; location: string; county: string }) {
    return this.sellersService.registerSeller(body.userId, body);
  }

  @Get()
  @ApiOperation({ summary: 'List sellers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  list(@Query('page') page?: number, @Query('status') status?: string) {
    return this.sellersService.listSellers(page, undefined, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get seller by ID' })
  getById(@Param('id') id: string) {
    return this.sellersService.getSeller(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get seller by slug' })
  getBySlug(@Param('slug') slug: string) {
    return this.sellersService.getSellerBySlug(slug);
  }

  @Get(':id/dashboard')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get seller dashboard data' })
  dashboard(@Param('id') id: string) {
    return this.sellersService.getSellerDashboard(id);
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update seller status (admin)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.sellersService.updateSellerStatus(id, status);
  }
}
