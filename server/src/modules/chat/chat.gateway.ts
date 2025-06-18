/* eslint-disable @typescript-eslint/no-floating-promises */
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

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string> = new Map(); // userId -> socketId

  constructor(
    @InjectRepository(MessagesEntity)
    private messageRepo: Repository<MessagesEntity>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new UnauthorizedException('Token not found');

      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      client.data.user = user;
      this.userSockets.set(user.id, client.id);
      console.log(`User connected: ${user.id} (${client.id})`);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.id;
    if (userId) {
      this.userSockets.delete(userId);
    }
    console.log(`User disconnected: ${userId}`);
  }

  // ✅ Join group
  @SubscribeMessage('join_group')
  handleJoinGroup(
    @MessageBody() data: { groupId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `group-${data.groupId}`;
    client.join(room);
    client.emit('joined_group', { groupId: data.groupId });
    console.log(`User ${client.data.user.id} joined ${room}`);
  }

  // ✅ Group chat
  @SubscribeMessage('group_chat')
  async handleGroupChat(
    @MessageBody() data: { groupId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `group-${data.groupId}`;

    const savedMessage = this.messageRepo.create({
      content: data.message,
      groupId: data.groupId,
      senderId: client.data.user.id,
    });
    await this.messageRepo.save(savedMessage);

    this.server.to(room).emit('group_chat', {
      groupId: data.groupId,
      message: data.message,
      senderId: client.data.user.id,
      createdAt: savedMessage.createdAt,
    });
  }

  // ✅ Single chat
  @SubscribeMessage('single_chat')
  async handleSingleChat(
    @MessageBody() data: { receiverId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const senderId = client.data.user.id;
    const receiverSocketId = this.userSockets.get(data.receiverId);

    const savedMessage = this.messageRepo.create({
      content: data.message,
      senderId,
      receiverId: data.receiverId,
    });
    await this.messageRepo.save(savedMessage);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('single_chat', {
        senderId,
        receiverId: data.receiverId,
        message: data.message,
        createdAt: savedMessage.createdAt,
      });
    }
  }
}
