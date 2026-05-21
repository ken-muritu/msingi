import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('logs/:productId')
  @ApiOperation({ summary: 'Get inventory logs for a product' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  getLogs(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.inventoryService.getInventoryLogs(productId, page, pageSize);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get products with low stock' })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  getLowStock(@Query('threshold') threshold?: number) {
    return this.inventoryService.getLowStockProducts(threshold);
  }
}
