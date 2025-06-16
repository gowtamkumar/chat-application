import { Expose } from 'class-transformer';
import { CallParticipantEnum } from '../enum/call-participant-status.enum';

export class CallParticipantsResponseDto {
  @Expose()
  id: string;

  @Expose()
  callId: string;

  @Expose()
  userId: string;

  @Expose()
  status: CallParticipantEnum;

  @Expose()
  joinedAt: string;

  @Expose()
  leftAt: string;
}
