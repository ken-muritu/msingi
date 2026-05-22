import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { Public } from '../auth/public.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product review' })
  create(@Body() body: {
    productId: string;
    userId: string;
    orderId?: string;
    rating: number;
    title: string;
    body: string;
    images?: string[];
  }) {
    return this.reviewsService.createReview(body);
  }

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Get reviews for a product' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: number,
  ) {
    return this.reviewsService.getProductReviews(productId, page);
  }

  @Public()
  @Post(':id/helpful')
  @ApiOperation({ summary: 'Mark a review as helpful' })
  markHelpful(@Param('id') id: string) {
    return this.reviewsService.markHelpful(id);
  }

  @Post(':id/seller-response')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add seller response to a review' })
  sellerResponse(
    @Param('id') id: string,
    @Body() body: { sellerId: string; response: string },
  ) {
    return this.reviewsService.addSellerResponse(id, body.sellerId, body.response);
  }
}
