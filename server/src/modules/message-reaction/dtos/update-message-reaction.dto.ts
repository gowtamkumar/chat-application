import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMessageReactionsDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  reactionType: string;
}
