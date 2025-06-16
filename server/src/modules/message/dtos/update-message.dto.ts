import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessagesDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
