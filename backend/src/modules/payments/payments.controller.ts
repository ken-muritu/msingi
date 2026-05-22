import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { Public } from '../auth/public.decorator';
import { StkPushDto, RefundDto } from './payments.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mpesa/stk-push')
  @ApiOperation({ summary: 'Initiate M-PESA STK Push payment' })
  initiateMpesa(@Body() dto: StkPushDto) {
    return this.paymentsService.initiateMpesaPayment(dto.orderId, dto.phone);
  }

  @Public()
  @SkipThrottle()
  @Post('mpesa/callback')
  @ApiOperation({ summary: 'M-PESA callback webhook (called by Safaricom)' })
  mpesaCallback(@Body() body: any) {
    return this.paymentsService.handleMpesaCallback(body);
  }

  @Public()
  @Get('mpesa/query/:checkoutRequestId')
  @ApiOperation({ summary: 'Poll M-PESA STK payment status' })
  queryMpesaStatus(@Param('checkoutRequestId') checkoutRequestId: string) {
    return this.paymentsService.queryMpesaStatus(checkoutRequestId);
  }

  @Get('transactions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction by ID' })
  getTransaction(@Param('id') id: string) {
    return this.paymentsService.getTransaction(id);
  }

  @Get('orders/:orderId/transactions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all transactions for an order' })
  getOrderTransactions(@Param('orderId') orderId: string) {
    return this.paymentsService.getOrderTransactions(orderId);
  }

  @Post('refund')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate a refund' })
  initiateRefund(@Body() dto: RefundDto) {
    return this.paymentsService.initiateRefund(dto.orderId, dto.amount, dto.reason);
  }
}
