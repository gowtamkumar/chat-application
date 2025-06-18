import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateMessagesDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  groupId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
