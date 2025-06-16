import { Expose } from 'class-transformer';

export class ScreenShareLogsResponseDto {
  @Expose()
  id: string;

  @Expose()
  callId: string;

  @Expose()
  sharerUserId: string;

  @Expose()
  startedAt: string;

  @Expose()
  endedAt: string;
}
