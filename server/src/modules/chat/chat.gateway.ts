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

  @SubscribeMessage('join_group')
  handleJoinGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const roomName = `group-${data.groupId}`;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    client.join(roomName);
    client.emit('joined_group', { groupId: data.groupId, roomName });
    console.log(`User ${client.id} joined group ${roomName}`);
  }

  @SubscribeMessage('group_chat')
  async handleGroupChat(
    @MessageBody()
    data: { groupId: string; message: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const roomName = `group-${data.groupId}`;

    // Save to DB (optional)
    const savedMessage = this.messageRepo.create({
      content: data.message,
      // groupId: data.groupId,
      userId: client.data.user.id,
    });
    await this.messageRepo.save(savedMessage);

    // Send to the group
    this.server.to(roomName).emit('group_chat', {
      groupId: data.groupId,
      message: data.message,
      userId: client.data.user.id,
      createdAt: savedMessage.createdAt,
    });
  }

  @SubscribeMessage('single_chat')
  async handleMessage(
    @MessageBody() content: any,
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const message = this.messageRepo.create({
      content: content.message,
      senderId: content.senderId,
      userId: client.data.user.id,
    });

    const resMessage = await this.messageRepo.save(message);
    this.server.emit('single_chat', {
      content: message.content,
      senderId: resMessage.senderId,
      userId: resMessage.userId,
      createdAt: message.createdAt,
    });
  }
}
