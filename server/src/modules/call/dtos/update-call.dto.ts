import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CallStatusEnum } from '../enum/call-status.enum';
import { CallTypeEnum } from '../enum/call-type.enum';

export class UpdateCallsDto {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsEnum(CallTypeEnum)
  @IsNotEmpty()
  type: CallTypeEnum;

  @IsEnum(CallStatusEnum)
  @IsNotEmpty()
  status: CallStatusEnum;
}
