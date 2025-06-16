import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageReactionsDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  reactionType: string;
}
