import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CallParticipantEnum } from '../enum/call-participant-status.enum';

export class CreateCallParticipantsDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  callId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(CallParticipantEnum)
  @IsDefined()
  @IsNotEmpty()
  status: CallParticipantEnum;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  joinedAt: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  leftAt: string;
}
