import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CallParticipantEnum } from '../enum/call-participant-status.enum';

export class UpdateCallParticipantsDto {
  @IsString()
  @IsNotEmpty()
  callId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(CallParticipantEnum)
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
