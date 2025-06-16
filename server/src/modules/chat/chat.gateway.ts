/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket, // ✅ you missed this
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@admin/user/entities/user.entity';
import { MessagesEntity } from '@modules/message/entities/message.entity';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*', // for dev only
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    @InjectRepository(MessagesEntity)
    private messageRepo: Repository<MessagesEntity>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new UnauthorizedException('Token not found');

      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      }); // ✅ replace with config
      client.data.user = user; // save the user in socket session
    } catch (err) {
      console.log('Unauthorized socket connection');
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('chat message')
  async handleMessage(
    @MessageBody() content: string,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    console.log(content);
    console.log(client.user);
    // id: '472cd74b-f301-41b0-aa8a-91ecf07e7a8a',
    const sender = {
      id: 'd947a179-4061-4a37-a046-afecfda406f1',
      email: 'gowam@gmail.com',
    };
    const message = this.messageRepo.create({
      content,
      senderId: sender.id,
    });
    console.log('message0', message);

    await this.messageRepo.save(message);

    this.server.emit('chat message', {
      content: message.content,
      sender,
      createdAt: message.createdAt,
    });
  }
}
