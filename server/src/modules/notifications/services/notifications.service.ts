// src/modules/notification/notification.service.ts
import { RequestContextDto } from '@common/dtos/request-context.dto';
import { ChatGateway } from '@modules/chat/chat.gateway';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterNotificationDto } from '../dtos/filter-message.dto';
import { NotificationEntity } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepo: Repository<NotificationEntity>,
    private chatGateway: ChatGateway,
  ) {}

  async sendNotification(receiverId: string, title: string, message: string) {
    // ✅ Save to DB
    const notification = this.notificationRepo.create({
      receiverId,
      title,
      message,
    });

    console.log('notification', notification);

    await this.notificationRepo.save(notification);

    // ✅ Send via WebSocket if user online
    const receiverSocketId = this.chatGateway.userSockets.get(receiverId);
    if (receiverSocketId) {
      this.chatGateway.server
        .to(receiverSocketId)
        .emit('receive_notification', {
          id: notification.id,
          title,
          message,
          createdAt: notification.createdAt,
        });
    }

    return notification;
  }

  async markAsRead(notificationId: string) {
    await this.notificationRepo.update(notificationId, { isRead: true });
  }

  async getUserNotifications(
    ctx: RequestContextDto,
    filterNotificationDto: FilterNotificationDto,
  ) {
    const { userId } = filterNotificationDto;
    return await this.notificationRepo.find({
      where: { receiverId: userId },
      order: { createdAt: 'DESC' },
    });
  }
}
