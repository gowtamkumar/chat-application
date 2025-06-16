import { Expose } from 'class-transformer';
import { MessageReceiptStatus } from '../enums/status.enum';

export class MessageReceiptsResponseDto {
  @Expose()
  id: string;

  @Expose()
  messageId: string;

  @Expose()
  userId: string;

  @Expose()
  status: MessageReceiptStatus;
}
