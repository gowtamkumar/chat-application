import { IsString } from 'class-validator';

export class FilterMessagesDto {
  @IsString()
  conversationId: string;

  @IsString()
  senderId: string;
}
