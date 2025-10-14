/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { MessagesEntity } from '@modules/message/entities/message.entity';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody, // ✅ you missed this
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

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
      console.error('Connection error:', err.message);
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

  // // ✅ Join group
  // @SubscribeMessage('join_group')
  // handleJoinGroup(
  //   @MessageBody() data: { groupId: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const room = `group-${data.groupId}`;
  //   client.join(room);
  //   client.emit('joined_group', { groupId: data.groupId });
  //   console.log(`User ${client.data.user.id} joined ${room}`);
  // }

  // // ✅ Group chat
  // @SubscribeMessage('group_chat')
  // async handleGroupChat(
  //   @MessageBody() data: { groupId: string; message: string },
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   const room = `group-${data.groupId}`;

  //   console.log('group_chat client', client);
  //   console.log('group_chat data', data);

  //   const savedMessage = this.messageRepo.create({
  //     content: data.message,
  //     groupId: data.groupId,
  //     senderId: client.data.user.id,
  //   });
  //   await this.messageRepo.save(savedMessage);

  //   this.server.to(room).emit('group_chat', {
  //     groupId: data.groupId,
  //     message: data.message,
  //     senderId: client.data.user.id,
  //     createdAt: savedMessage.createdAt,
  //   });
  // }

  @SubscribeMessage('single_chat')
  async handleSingleChat(
    @MessageBody() data: { senderId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const senderId = client.data.user.id;

      // Save message to DB
      const savedMessage = this.messageRepo.create({
        content: data.content,
        senderId,
        receiverId: data.senderId,
      });
      await this.messageRepo.save(savedMessage);

      // ✅ Get receiver's socket ID
      const receiverSocketId = this.userSockets.get(data.senderId);

      // ✅ Send to receiver only
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('single_chat', {
          senderId,
          receiverId: data.senderId,
          content: data.content,
          createdAt: savedMessage.createdAt,
        });
      } else {
        client.emit('user_offline', { userId: data.senderId });
      }

      // ✅ Optional: Notify sender too (for instant UI update)
      client.emit('single_chat_sent', {
        receiverId: data.senderId,
        content: data.content,
        createdAt: savedMessage.createdAt,
      });
    } catch (error) {
      console.error('Error in single_chat:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }
}
