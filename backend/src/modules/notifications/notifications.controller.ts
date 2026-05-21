import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get notifications for a user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  getUserNotifications(
    @Param('userId') userId: string,
    @Query('page') page?: number,
  ) {
    return this.notificationsService.getUserNotifications(userId, page);
  }
}
