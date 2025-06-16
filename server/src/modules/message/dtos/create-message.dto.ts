import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessagesDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;
}
