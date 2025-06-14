import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@admin/user/entities/user.entity';
import { MessagesEntity } from '@modules/message/entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, MessagesEntity]), // 👈 IMPORTANT
  ],

  providers: [ChatGateway, JwtService, ConfigService],
})
export class ChatModule {}
