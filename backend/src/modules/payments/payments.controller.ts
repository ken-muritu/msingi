import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mpesa/stk-push')
  @ApiOperation({ summary: 'Initiate M-PESA STK Push payment' })
  initiateMpesa(@Body() body: { orderId: string; phone: string }) {
    return this.paymentsService.initiateMpesaPayment(body.orderId, body.phone);
  }

  @Post('mpesa/callback')
  @ApiOperation({ summary: 'M-PESA callback webhook (called by Safaricom)' })
  mpesaCallback(@Body() body: any) {
    return this.paymentsService.handleMpesaCallback(body);
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
  initiateRefund(@Body() body: { orderId: string; amount: number; reason?: string }) {
    return this.paymentsService.initiateRefund(body.orderId, body.amount, body.reason);
  }
}
