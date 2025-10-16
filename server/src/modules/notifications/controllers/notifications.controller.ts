import { RequestContext } from '@common/decorators/current-user.decorator';
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { FilterNotificationDto } from '../dtos/filter-message.dto';
import { NotificationService } from '../services/notifications.service';

@Controller('notifications')
export class NotificationsController {
  private logger = new Logger(NotificationsController.name);

  constructor(private readonly notitication: NotificationService) {}

  @Get('/')
  async getNotifications(
    @RequestContext() ctx: RequestContextDto,
    @Query() filterNotificationDto: FilterNotificationDto,
  ) {
    // this.logger.verbose(`User "${ctx?.user?.username}" retieving Messagess.`);

    const notifications = await this.notitication.getUserNotifications(
      ctx,
      filterNotificationDto,
    );

    return {
      success: true,
      statusCode: 200,
      message: `List of notifications`,
      totalRecords: notifications.length,
      data: notifications,
    };
  }
}
