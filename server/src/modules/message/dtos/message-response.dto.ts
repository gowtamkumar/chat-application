import { Expose } from 'class-transformer';

export class MessagesResponseDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;

  @Expose()
  senderId: string;

  @Expose()
  content: string;
}
