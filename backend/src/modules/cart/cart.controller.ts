import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Public } from '../auth/public.decorator';
import { AddCartItemDto, UpdateCartItemDto, MergeCartDto } from './cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get cart (by userId from JWT or sessionId query param)' })
  @ApiQuery({ name: 'sessionId', required: false })
  getCart(@Request() req: any, @Query('sessionId') sessionId?: string) {
    const userId = req.user?.id;
    return this.cartService.getCart(userId, sessionId);
  }

  @Public()
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiQuery({ name: 'sessionId', required: false })
  addItem(
    @Request() req: any,
    @Body() dto: AddCartItemDto,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.addItem({ userId: req.user?.id, sessionId, ...dto });
  }

  @Public()
  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiQuery({ name: 'sessionId', required: false })
  updateItem(
    @Request() req: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.updateItem({ userId: req.user?.id, sessionId, itemId, quantity: dto.quantity });
  }

  @Public()
  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiQuery({ name: 'sessionId', required: false })
  removeItem(
    @Request() req: any,
    @Param('itemId') itemId: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.removeItem({ userId: req.user?.id, sessionId, itemId });
  }

  @Public()
  @Delete()
  @ApiOperation({ summary: 'Clear entire cart' })
  @ApiQuery({ name: 'sessionId', required: false })
  clearCart(@Request() req: any, @Query('sessionId') sessionId?: string) {
    return this.cartService.clearCart(req.user?.id, sessionId);
  }

  @Post('merge')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Merge guest cart into user cart after login' })
  mergeCart(@Request() req: any, @Body() dto: MergeCartDto) {
    return this.cartService.mergeGuestCart(dto.sessionId, req.user.id);
  }
}
