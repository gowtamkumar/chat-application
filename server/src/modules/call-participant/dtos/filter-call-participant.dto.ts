import { IsString } from 'class-validator';
import { CallParticipantEnum } from '../enum/call-participant-status.enum';

export class FilterCallParticipantsDto {
  @IsString()
  callId: string;

  @IsString()
  status: CallParticipantEnum;
}
