import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MessageReceiptStatus } from '../enums/status.enum';

export class CreateMessageReceiptsDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(MessageReceiptStatus)
  @IsOptional()
  status: MessageReceiptStatus;
}
