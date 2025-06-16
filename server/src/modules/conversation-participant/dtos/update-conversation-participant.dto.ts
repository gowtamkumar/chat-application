import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConversationParticipantDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
