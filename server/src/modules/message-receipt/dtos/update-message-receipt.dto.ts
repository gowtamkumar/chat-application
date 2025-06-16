import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MessageReceiptStatus } from '../enums/status.enum';

export class UpdateMessageReceiptsDto {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(MessageReceiptStatus)
  @IsOptional()
  status: MessageReceiptStatus;
}
