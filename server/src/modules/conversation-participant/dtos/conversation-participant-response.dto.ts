import { Expose } from 'class-transformer';
export class ConversationParticipantResponseDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;

  @Expose()
  userId: string;
}
