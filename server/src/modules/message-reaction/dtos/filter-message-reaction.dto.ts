import { IsString } from 'class-validator';

export class FilterMessageReactionsDto {
  @IsString()
  messageId: string;

  @IsString()
  userId: string;

  @IsString()
  reactionType: string;
}
