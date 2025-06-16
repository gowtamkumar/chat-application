import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateConversationParticipantDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;
}
