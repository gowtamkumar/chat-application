import { IsString } from 'class-validator';
import { CallTypeEnum } from '../enum/call-type.enum';
import { CallStatusEnum } from '../enum/call-status.enum';

export class FilterCallsDto {
  @IsString()
  conversationId: string;

  @IsString()
  type: CallTypeEnum;

  @IsString()
  status: CallStatusEnum;
}
