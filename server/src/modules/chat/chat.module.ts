import { MessagesEntity } from '@modules/message/entities/message.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessagesEntity]),
    // forwardRef(() => NotificationsModule), // 👈 IMPORTANT
  ],
  exports: [ChatGateway],
  providers: [ChatGateway, JwtService, ConfigService],
})
export class ChatModule {}
