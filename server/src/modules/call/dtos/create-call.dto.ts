import { IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CallTypeEnum } from '../enum/call-type.enum';
import { CallStatusEnum } from '../enum/call-status.enum';

export class CreateCallsDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsEnum(CallTypeEnum)
  @IsDefined()
  @IsNotEmpty()
  type: CallTypeEnum;

  @IsEnum(CallStatusEnum)
  @IsDefined()
  @IsNotEmpty()
  status: CallStatusEnum;
}
