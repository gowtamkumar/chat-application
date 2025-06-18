import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  receiverId: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  groupId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  content: string;
}
