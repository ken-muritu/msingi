import { Controller, Get, Post, Put, Param, Query, Body, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Public } from '../auth/public.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new order (checkout) — works for guests and logged-in users' })
  createOrder(@Body() body: any) {
    return this.ordersService.createOrder(body);
  }

  @Get('my')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for the currently logged-in user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getMyOrders(@Request() req: any, @Query('page') page?: number) {
    return this.ordersService.getUserOrders(req.user.id, page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Public()
  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Get order by order number' })
  getOrderByNumber(@Param('orderNumber') orderNumber: string) {
    return this.ordersService.getOrderByNumber(orderNumber);
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for a user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getUserOrders(
    @Param('userId') userId: string,
    @Query('page') page?: number,
  ) {
    return this.ordersService.getUserOrders(userId, page);
  }

  @Get('seller/:sellerId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get orders for a seller' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getSellerOrders(
    @Param('sellerId') sellerId: string,
    @Query('page') page?: number,
  ) {
    return this.ordersService.getSellerOrders(sellerId, page);
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateOrderStatus(id, status);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all orders (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false })
  getAllOrders(
    @Query('page') page?: number,
    @Query('status') status?: string,
  ) {
    return this.ordersService.getAllOrders(page, undefined, status);
  }
}
