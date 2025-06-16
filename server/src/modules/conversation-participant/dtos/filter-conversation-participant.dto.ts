import { IsString } from 'class-validator';

export class FilterConversationParticipantDto {
  @IsString()
  conversationId: string;

  @IsString()
  userId: string;
}
