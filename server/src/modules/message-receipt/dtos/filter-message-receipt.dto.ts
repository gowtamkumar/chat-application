import { IsEnum, IsString } from 'class-validator';
import { MessageReceiptStatus } from '../enums/status.enum';

export class FilterMessageReceiptsDto {
  @IsString()
  messageId: string;

  @IsString()
  userId: string;

  @IsEnum(MessageReceiptStatus)
  status: MessageReceiptStatus;
}
