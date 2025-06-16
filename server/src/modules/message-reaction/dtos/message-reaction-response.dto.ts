import { Expose } from 'class-transformer';

export class MessageReactionsResponseDto {
  @Expose()
  id: string;

  @Expose()
  messageId: string;

  @Expose()
  userId: string;

  @Expose()
  reactionType: string;
}
