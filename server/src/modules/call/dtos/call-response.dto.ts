import { Expose } from 'class-transformer';
import { CallTypeEnum } from '../enum/call-type.enum';
import { CallStatusEnum } from '../enum/call-status.enum';

export class CallsResponseDto {
  @Expose()
  id: string;

  @Expose()
  conversationId: string;
  @Expose()
  type: CallTypeEnum;

  @Expose()
  status: CallStatusEnum;
}
